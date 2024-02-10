import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { HomePageRoutingModule } from './home-routing.module';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import {ReversePipe} from "../pipes/reverse.pipe";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HomePageRoutingModule,
    NgxScannerQrcodeModule,
    ReversePipe,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
