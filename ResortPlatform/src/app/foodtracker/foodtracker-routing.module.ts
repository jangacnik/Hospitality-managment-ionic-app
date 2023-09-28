import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodtrackerPage } from './foodtracker.page';

const routes: Routes = [
  {
    path: '',
    component: FoodtrackerPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodtrackerPageRoutingModule {}
