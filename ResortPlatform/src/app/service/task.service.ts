import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) { }

  public assignUser(user, taskListId, taskId): Observable<any> {
    return this.http.put<any>(
      environment.baseUrlTest + `task/archive/assign`, {
        "assignee": user,
        "taskListId": taskListId,
        "taskId": taskId
      },
    );
  }

  public addRating(user, taskListId, taskId, rating): Observable<any> {
    return this.http.put<any>(
      environment.baseUrlTest + `task/archive/rate`, {
        "user": user,
        "taskListId": taskListId,
        "taskId": taskId,
        "rating": rating
      },
    );
  }

  public addComment(user, taskListId, taskId, comment): Observable<any> {
    return this.http.put<any>(
      environment.baseUrlTest + `task/archive/comment`, {
        "user": user,
        "taskListId": taskListId,
        "taskId": taskId,
        "comment": comment
      },
    );
  }
}
