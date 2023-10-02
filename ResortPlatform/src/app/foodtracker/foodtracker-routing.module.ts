import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodtrackerPage } from './foodtracker.page';
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";

const routes: Routes = [
  {
    path: '',
    component: FoodtrackerPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [BarcodeScanner],
  exports: [RouterModule]
})
export class FoodtrackerPageRoutingModule {}
