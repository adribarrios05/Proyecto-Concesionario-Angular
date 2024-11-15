import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from '../components/navbar/navbar.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SideMenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    CommonModule,
    IonicModule,
    SideMenuComponent,
    FormsModule,
    RouterModule
  ]
})
export class SharedModule { }
