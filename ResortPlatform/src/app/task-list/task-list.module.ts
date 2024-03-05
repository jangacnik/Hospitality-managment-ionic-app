import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { TaskListPage } from './task-list.page';
import {AppModule} from "../app.module";
import {Autosize} from "../directives/autosize";
import {DateModalComponent} from "../modal/util/date-modal/date-modal.component";
import {TaskListPageRoutingModule} from "./task-list-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskListPageRoutingModule,
    Autosize
  ],
  declarations: [TaskListPage, DateModalComponent]
})
export class TodoListPageModule {}
