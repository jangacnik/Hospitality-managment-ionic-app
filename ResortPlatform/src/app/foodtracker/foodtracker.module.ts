import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodtrackerPage } from './foodtracker.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FoodtrackerPageRoutingModule } from './foodtracker-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FoodtrackerPageRoutingModule
  ],
  declarations: [FoodtrackerPage]
})
export class FoodtrackerPageModule {}
