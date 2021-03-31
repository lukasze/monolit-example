import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMeal, Meal } from '../meal.model';
import { MealService } from '../service/meal.service';
import { IFood } from 'app/entities/food/food.model';
import { FoodService } from 'app/entities/food/service/food.service';

@Component({
  selector: 'jhi-meal-update',
  templateUrl: './meal-update.component.html',
})
export class MealUpdateComponent implements OnInit {
  isSaving = false;

  foodsSharedCollection: IFood[] = [];

  editForm = this.fb.group({
    id: [],
    date: [],
    quantity: [],
    food: [],
  });

  constructor(
    protected mealService: MealService,
    protected foodService: FoodService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ meal }) => {
      this.updateForm(meal);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const meal = this.createFromForm();
    if (meal.id !== undefined) {
      this.subscribeToSaveResponse(this.mealService.update(meal));
    } else {
      this.subscribeToSaveResponse(this.mealService.create(meal));
    }
  }

  trackFoodById(index: number, item: IFood): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMeal>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(meal: IMeal): void {
    this.editForm.patchValue({
      id: meal.id,
      date: meal.date,
      quantity: meal.quantity,
      food: meal.food,
    });

    this.foodsSharedCollection = this.foodService.addFoodToCollectionIfMissing(this.foodsSharedCollection, meal.food);
  }

  protected loadRelationshipsOptions(): void {
    this.foodService
      .query()
      .pipe(map((res: HttpResponse<IFood[]>) => res.body ?? []))
      .pipe(map((foods: IFood[]) => this.foodService.addFoodToCollectionIfMissing(foods, this.editForm.get('food')!.value)))
      .subscribe((foods: IFood[]) => (this.foodsSharedCollection = foods));
  }

  protected createFromForm(): IMeal {
    return {
      ...new Meal(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      food: this.editForm.get(['food'])!.value,
    };
  }
}
