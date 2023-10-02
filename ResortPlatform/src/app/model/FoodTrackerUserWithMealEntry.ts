import {FoodTrackerUser} from "./FoodTrackerUser";
import {MealEntry} from "./MealEntry";


export class FoodTrackerUserWithMealEntry {
  user: FoodTrackerUser;
  mealEntry: MealEntry;
  constructor(user: FoodTrackerUser, mealEntry: MealEntry) {
    this.user = user;
    this.mealEntry = mealEntry;
  }
}
