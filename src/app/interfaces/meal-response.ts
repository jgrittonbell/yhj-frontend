import { FoodEntry } from './food-entry';

export interface MealResponse {
  id: number;
  mealName: string;
  timeEaten: string;
  foods: FoodEntry[];
}
