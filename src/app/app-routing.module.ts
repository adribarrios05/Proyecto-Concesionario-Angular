import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { DataManagementPage } from './folder/pages/admin/data-management/data-management.page';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./folder/pages/inventory/inventory.module').then(
        (m) => m.InventoryPageModule
      ),
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('./folder/pages/sales-history/sales-history.module').then(
        (m) => m.SalesHistoryPageModule
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./folder/pages/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./folder/pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./folder/pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./folder/pages/customers/customers.module').then(
        (m) => m.CustomersPageModule
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./folder/pages/profile/profile.module').then(
        (m) => m.ProfilePageModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'about-us',
    loadChildren: () =>
      import('./folder/pages/about-us/about-us.module').then(
        (m) => m.AboutUsPageModule
      ),
  },
  {
    path: 'admin/data-management',
    loadChildren: () =>
      import(
        './folder/pages/admin/data-management/data-management.module'
      ).then((m) => m.DataManagementPageModule),
    canActivate: [adminGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
