import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataManagementPageRoutingModule } from './data-management-routing.module';
import { DataManagementPage } from './data-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DataManagementPageRoutingModule
  ],
  declarations: [DataManagementPage]
})
export class DataManagementPageModule {}
