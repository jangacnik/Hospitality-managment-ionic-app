import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { JwtModel } from '../model/JwtModel';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signin(email: string, pass: string): Observable<JwtModel> {
    return this.http.post<JwtModel>(
      'http://localhost:8888/api/v1/auth/signin',
      {
        email: email,
        password: pass,
      }
    );
  }
}
