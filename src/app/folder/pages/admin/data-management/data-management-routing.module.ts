import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataManagementPage } from './data-management.page';

const routes: Routes = [
  {
    path: '',
    component: DataManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagementPageRoutingModule {}
