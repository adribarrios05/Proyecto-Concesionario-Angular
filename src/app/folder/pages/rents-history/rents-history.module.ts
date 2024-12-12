import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RentsHistoryPageRoutingModule } from './rents-history-routing.module';

import { RentsHistoryPage } from './rents-history.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    RentsHistoryPageRoutingModule,
    SharedModule,
    TranslateModule.forChild(),
  ],
  declarations: [RentsHistoryPage]
})
export class RentsHistoryPageModule {}
