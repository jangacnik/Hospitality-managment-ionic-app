import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodTrackerPage } from './food-tracker.page';
import { QrComponent } from './qr/qr.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import {ZXingScannerModule} from "@zxing/ngx-scanner";

const routes: Routes = [
  {
    path: '',
    component: FoodTrackerPage,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('../login/login.module').then((m) => m.LoginPageModule),
      },
    ],
  },
];

@NgModule({
  declarations: [QrComponent],
    imports: [
        RouterModule.forChild(routes),
        IonicModule,
        AsyncPipe,
        JsonPipe,
        NgIf,
        NgxScannerQrcodeModule,
        NgForOf,
        FormsModule,
        ZXingScannerModule,
    ],
  providers: [BarcodeScanner],
  exports: [RouterModule, QrComponent],
})
export class FoodTrackerPageRoutingModule {}
