import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {IonicStorageModule} from "@ionic/storage-angular";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JwtInterceptor} from "./interceptor/jwt.interceptor";
import {NgxScannerQrcodeModule} from "ngx-scanner-qrcode";
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {ReversePipe} from "./pipes/reverse.pipe";
import {Autosize} from "./directives/autosize";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule,
    IonicStorageModule.forRoot(), HttpClientModule, NgxScannerQrcodeModule,
    ZXingScannerModule,
    IonicModule.forRoot({
      platform: {
        /** The default `desktop` function returns false for devices with a touchscreen.
         * This is not always wanted, so this function tests the User Agent instead.
         **/
        'desktop': (win) => {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent);
          return !isMobile;
        }
      },
    }),],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
