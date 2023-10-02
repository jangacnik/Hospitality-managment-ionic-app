import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FoodTrackerUser} from "../model/FoodTrackerUser";
import {Observable} from "rxjs";
import {FoodTrackerUserWithMealEntry} from "../model/FoodTrackerUserWithMealEntry";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  set foodTrackerUser(value: FoodTrackerUser) {
    this._foodTrackerUser = value;
  }
  get foodTrackerUser() {
    return this.foodTrackerUser;
  }

  private _foodTrackerUser: FoodTrackerUser | undefined;

  constructor(private http: HttpClient) { }

  public getUserInfo(): Observable<FoodTrackerUser> {
    return this.http.get<FoodTrackerUser>("http://0.0.0.0:8888/api/v1/department/user/me");
  }

  public getCurrentMonthTracking(id: string): Observable<FoodTrackerUserWithMealEntry> {
    return this.http.get<FoodTrackerUserWithMealEntry>("http://0.0.0.0:8888/api/v1/track/" + id);
  }



    public trackMeal(id: string): Observable<void> {
    return this.http.post<void>("http://0.0.0.0:8888/api/v1/track", {
      employeeNumber: id
    });
  }
}
