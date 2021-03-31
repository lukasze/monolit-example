jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MealService } from '../service/meal.service';
import { IMeal, Meal } from '../meal.model';
import { IFood } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';

import { MealUpdateComponent } from './meal-update.component';

describe('Component Tests', () => {
  describe('Meal Management Update Component', () => {
    let comp: MealUpdateComponent;
    let fixture: ComponentFixture<MealUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let mealService: MealService;
    let foodService: FoodService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MealUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MealUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MealUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      mealService = TestBed.inject(MealService);
      foodService = TestBed.inject(FoodService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Food query and add missing value', () => {
        const meal: IMeal = { id: 456 };
        const food: IFood = { id: 86173 };
        meal.food = food;

        const foodCollection: IFood[] = [{ id: 69555 }];
        spyOn(foodService, 'query').and.returnValue(of(new HttpResponse({ body: foodCollection })));
        const additionalFoods = [food];
        const expectedCollection: IFood[] = [...additionalFoods, ...foodCollection];
        spyOn(foodService, 'addFoodToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ meal });
        comp.ngOnInit();

        expect(foodService.query).toHaveBeenCalled();
        expect(foodService.addFoodToCollectionIfMissing).toHaveBeenCalledWith(foodCollection, ...additionalFoods);
        expect(comp.foodsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const meal: IMeal = { id: 456 };
        const food: IFood = { id: 77103 };
        meal.food = food;

        activatedRoute.data = of({ meal });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(meal));
        expect(comp.foodsSharedCollection).toContain(food);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const meal = { id: 123 };
        spyOn(mealService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ meal });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: meal }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(mealService.update).toHaveBeenCalledWith(meal);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const meal = new Meal();
        spyOn(mealService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ meal });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: meal }));
        saveSubject.complete();

        // THEN
        expect(mealService.create).toHaveBeenCalledWith(meal);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const meal = { id: 123 };
        spyOn(mealService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ meal });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(mealService.update).toHaveBeenCalledWith(meal);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackFoodById', () => {
        it('Should return tracked Food primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackFoodById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
