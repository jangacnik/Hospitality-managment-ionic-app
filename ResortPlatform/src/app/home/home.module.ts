import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { HomePageRoutingModule } from './home-routing.module';
// import { LoginPageModule } from './login/login.module';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { QrComponent } from '../foodtracker/qr/qr.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HomePageRoutingModule,
    //LoginPageModule,
    NgxScannerQrcodeModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
