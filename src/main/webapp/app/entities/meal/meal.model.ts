import * as dayjs from 'dayjs';
import { IFood } from 'app/entities/food/food.model';

export interface IMeal {
  id?: number;
  date?: dayjs.Dayjs | null;
  quantity?: number | null;
  food?: IFood | null;
}

export class Meal implements IMeal {
  constructor(public id?: number, public date?: dayjs.Dayjs | null, public quantity?: number | null, public food?: IFood | null) {}
}

export function getMealIdentifier(meal: IMeal): number | undefined {
  return meal.id;
}
