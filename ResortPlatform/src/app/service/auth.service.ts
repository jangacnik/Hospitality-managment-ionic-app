import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { JwtModel } from '../model/JwtModel';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signin(email: string, pass: string): Observable<JwtModel> {
    return this.http.post<JwtModel>(
      environment.baseUrlTest+'auth/signin',
      {
        email: email,
        password: pass,
      }
    );
  }
}
