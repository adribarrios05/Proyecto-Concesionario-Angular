import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inventory',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./folder/pages/inventory/inventory.module').then( m => m.InventoryPageModule)
  },
  {
    path: 'sales-history',
    loadChildren: () => import('./folder/pages/sales-history/sales-history.module').then( m => m.SalesHistoryPageModule)
  },
  {
    path: 'rents-history',
    loadChildren: () => import('./folder/pages/rents-history/rents-history.module').then( m => m.RentsHistoryPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
