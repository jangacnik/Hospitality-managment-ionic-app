import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {StorageService} from "../service/storage.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private storage: StorageService) {}

  // @ts-ignore
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.storage.jwt) {
          return next.handle(req);
        }

        const req1 = req.clone({
          headers: req.headers.append('Authorization', `Bearer ${this.storage.jwt}`),
        });
        return next.handle(req1);
  }
}
