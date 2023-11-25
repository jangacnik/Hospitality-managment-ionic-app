import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FoodTrackerUser } from '../model/FoodTrackerUser';
import { Observable } from 'rxjs';
import { FoodTrackerUserWithMealEntry } from '../model/FoodTrackerUserWithMealEntry';

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
        'http://localhost:8888/api/v1/department/user/me',
        { headers: headers }
      );
    } else {
      return this.http.get<FoodTrackerUser>(
        'http://localhost:8888/api/v1/department/user/me'
      );
    }
  }

  public getCurrentMonthTracking(
    id: string
  ): Observable<FoodTrackerUserWithMealEntry> {
    return this.http.get<FoodTrackerUserWithMealEntry>(
      'http://localhost:8888/api/v1/track/' + id
    );
  }

  public trackMeal(dataModel: any): Observable<void> {
    return this.http.post<void>(
      'http://localhost:8888/api/v1/track',
      dataModel
    );
  }

  public addReservation(dataModel: any): Observable<void> {
    return this.http.post<void>(
      'http://localhost:8888/api/v1/reserve',
      dataModel
    );
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
    return this.http.delete<void>(`http://localhost:8888/api/v1/reserve/`, {
      headers: headers,
      body: body,
    });
  }

  public getAllReservations(): Observable<void> {
    return this.http.get<void>('http://localhost:8888/api/v1/reserve');
  }
}
