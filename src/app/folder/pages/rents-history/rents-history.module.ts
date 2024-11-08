import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RentsHistoryPageRoutingModule } from './rents-history-routing.module';

import { RentsHistoryPage } from './rents-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RentsHistoryPageRoutingModule
  ],
  declarations: [RentsHistoryPage]
})
export class RentsHistoryPageModule {}
