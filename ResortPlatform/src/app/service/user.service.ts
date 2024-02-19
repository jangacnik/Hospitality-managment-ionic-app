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
    return this._foodTrackerUser;
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
    jwt: string,
    reservationDate: string,
  ): Observable<void> {
    let headers = new HttpHeaders();
    headers.set('Authorization', 'Bearer ' + jwt);
    let body = {
      id: reservationId,
      reservationDate: reservationDate,
    };
    return this.http.delete<void>(environment.baseUrlTest + `reserve`, {
      headers: headers,
      body: body,
    });
  }

  public getAllReservations(): Observable<void> {
    return this.http.get<void>(environment.baseUrlTest + 'reserve');
  }

  public getTaskList(date: string): Observable<void> {
    return this.http.get<void>(
      environment.baseUrlTest + `task/archive/${date}`
    );
  }

  public changeTaskStatus(dataModel: any): Observable<void> {
    return this.http.post<void>(
      environment.baseUrlTest + 'task/archive/status',
      dataModel
    );
  }

  public getAvailableShifts(date: string, depId: string): Observable<any> {
    return this.http.get<any>(
      environment.baseUrlTest + `admin/${date}/available/${depId}`
    );
  }
}
