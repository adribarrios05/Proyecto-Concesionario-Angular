import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesHistoryPageRoutingModule } from './sales-history-routing.module';

import { SalesHistoryPage } from './sales-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesHistoryPageRoutingModule
  ],
  declarations: [SalesHistoryPage]
})
export class SalesHistoryPageModule {}
