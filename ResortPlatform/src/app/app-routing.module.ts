import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LOAD_WASM } from 'ngx-scanner-qrcode';
import { Path } from 'src/app/shared/enums/Paths';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: Path.LOGIN,
    loadChildren: () =>
      import('./home/login/login.module').then((m) => m.LoginPageModule),
  },
];

LOAD_WASM().subscribe();
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
