import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FoodTrackerUser } from '../model/FoodTrackerUser';
import { Observable } from 'rxjs';
import { FoodTrackerUserWithMealEntry } from '../model/FoodTrackerUserWithMealEntry';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  set foodTrackerUser(value: FoodTrackerUser) {
    this._foodTrackerUser = value;
  }
  get foodTrackerUser() {
    return this.foodTrackerUser;
  }

  private _foodTrackerUser: FoodTrackerUser | undefined;

  constructor(private http: HttpClient) {}

  public getUserInfo(jwt?: string): Observable<FoodTrackerUser> {
    if (jwt) {
      let headers = new HttpHeaders();
      headers.set('Authorization', 'Bearer ' + jwt);
      return this.http.get<FoodTrackerUser>(
        environment.baseUrlTest + 'department/user/me',
        { headers: headers }
      );
    } else {
      return this.http.get<FoodTrackerUser>(
        environment.baseUrlTest + 'department/user/me'
      );
    }
  }

  public getCurrentMonthTracking(
    id: string
  ): Observable<FoodTrackerUserWithMealEntry> {
    return this.http.get<FoodTrackerUserWithMealEntry>(
      environment.baseUrlTest + 'track/' + id
    );
  }

  public trackMeal(dataModel: any): Observable<void> {
    return this.http.post<void>(environment.baseUrlTest + 'track', dataModel);
  }

  public addReservation(dataModel: any): Observable<void> {
    return this.http.post<void>(environment.baseUrlTest + 'reserve', dataModel);
  }

  public deleteReservationById(
    reservationId: number,
    jwt: string
  ): Observable<void> {
    let headers = new HttpHeaders();
    headers.set('Authorization', 'Bearer ' + jwt);
    let body = {
      id: reservationId,
      employeeNumber: '02',
      mealType: ['DINNER'],
      reservationDate: '2023-11-26',
    };
    return this.http.delete<void>(environment.baseUrlTest + `reserve/`, {
      headers: headers,
      body: body,
    });
  }

  public getAllReservations(): Observable<void> {
    return this.http.get<void>(environment.baseUrlTest + 'reserve');
  }
}
