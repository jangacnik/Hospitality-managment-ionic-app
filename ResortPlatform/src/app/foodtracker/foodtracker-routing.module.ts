import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodtrackerPage } from './foodtracker.page';
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import {QrComponent} from "./qr/qr.component";
import {IonicModule} from "@ionic/angular";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {NgxScannerQrcodeModule} from "ngx-scanner-qrcode";

const routes: Routes = [
  {
    path: '',
    component: FoodtrackerPage,
  }
];

@NgModule({
  declarations: [QrComponent],
  imports: [RouterModule.forChild(routes), IonicModule, AsyncPipe, JsonPipe, NgIf, NgxScannerQrcodeModule],
  providers: [BarcodeScanner],
  exports: [RouterModule, QrComponent]
})
export class FoodtrackerPageRoutingModule {}
