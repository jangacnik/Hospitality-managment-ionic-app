import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { QrComponent } from '../foodtracker/qr/qr.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('../home/login/login.module').then((m) => m.LoginPageModule),
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
  ],
  providers: [BarcodeScanner],
  exports: [RouterModule, QrComponent],
})
export class HomePageRoutingModule {}
