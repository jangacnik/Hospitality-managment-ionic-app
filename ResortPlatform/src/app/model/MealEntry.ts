export class MealEntry {
  mealCount: number;
  meals: Map<number, Date>;

  constructor(mealCount: number, meals: Map<number, Date>) {
    this.mealCount = mealCount;
    this.meals = meals;
  }
}
