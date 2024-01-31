import { Injectable, OnInit } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../service/storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor, OnInit {
  private jwt = '';
  constructor(private storage: StorageService) {
    this.storage.jwtChangedSub.subscribe((jwt) => {
      this.jwt = jwt;
    });
  }

  // @ts-ignore
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      headers: req.headers.append('Access-Control-Allow-Origin', `*`),
    });
    if (req.headers.get('Authorization')) {
      return next.handle(req);
    }
    if (req.headers.get('refreshToken')) {
      return next.handle(req);
    }
    if (!this.jwt) {
      return next.handle(req);
    }

    const req1 = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${this.jwt}`),
    });
    return next.handle(req1);
  }

  ngOnInit(): void {
    this.storage.jwtChangedSub.subscribe((jwt) => {
      this.jwt = jwt;
    });
  }
}
