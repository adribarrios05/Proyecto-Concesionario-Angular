import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentsHistoryPage } from './rents-history.page';

const routes: Routes = [
  {
    path: '',
    component: RentsHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentsHistoryPageRoutingModule {}
