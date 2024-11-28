import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'inventory',
    loadChildren: () => import('./folder/pages/inventory/inventory.module').then( m => m.InventoryPageModule)
  },
  {
    path: 'sales',
    loadChildren: () => import('./folder/pages/sales-history/sales-history.module').then( m => m.SalesHistoryPageModule)
  },
  {
    path: 'rents',
    loadChildren: () => import('./folder/pages/rents-history/rents-history.module').then( m => m.RentsHistoryPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./folder/pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./folder/pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./folder/pages/register/register.module').then( m => m.RegisterPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
