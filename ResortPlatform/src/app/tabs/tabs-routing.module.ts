import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'food-tracker',
        loadChildren: () =>
          import('../food-tracker/food-tracker.module').then((m) => m.FoodTrackerPageModule),
      },
      {
        path: 'task-list',
        loadChildren: () =>
          import('../task-list/task-list.module').then(
            (m) => m.TodoListPageModule
          ),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('../user/user.module').then((m) => m.UserPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/food-tracker',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/food-tracker',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
