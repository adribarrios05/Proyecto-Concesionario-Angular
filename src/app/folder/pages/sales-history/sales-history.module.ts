import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesHistoryPageRoutingModule } from './sales-history-routing.module';

import { SalesHistoryPage } from './sales-history.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    SalesHistoryPageRoutingModule,
    SharedModule,
    TranslateModule.forChild(),
  ],
  declarations: [SalesHistoryPage]
})
export class SalesHistoryPageModule {}
