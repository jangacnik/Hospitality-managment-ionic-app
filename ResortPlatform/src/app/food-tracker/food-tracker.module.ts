import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodTrackerPage } from './food-tracker.page';
import { FoodTrackerPageRoutingModule } from './food-tracker-routing.module';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import {ReversePipe} from "../pipes/reverse.pipe";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FoodTrackerPageRoutingModule,
    NgxScannerQrcodeModule,
    ReversePipe,
  ],
  declarations: [FoodTrackerPage],
})
export class FoodTrackerPageModule {}
