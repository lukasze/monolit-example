import { IMeal } from 'app/entities/meal/meal.model';

export interface IFood {
  id?: number;
  name?: string | null;
  calories?: number | null;
  proteins?: number | null;
  carbs?: number | null;
  fats?: number | null;
  meals?: IMeal[] | null;
}

export class Food implements IFood {
  constructor(
    public id?: number,
    public name?: string | null,
    public calories?: number | null,
    public proteins?: number | null,
    public carbs?: number | null,
    public fats?: number | null,
    public meals?: IMeal[] | null
  ) {}
}

export function getFoodIdentifier(food: IFood): number | undefined {
  return food.id;
}
