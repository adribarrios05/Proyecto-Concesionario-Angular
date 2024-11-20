import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../components/navbar/navbar.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SideMenuComponent } from '../components/side-menu/side-menu.component';



@NgModule({
  declarations: [
    NavBarComponent,
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
    NavBarComponent,
    SideMenuComponent,
    FormsModule,
    RouterModule
  ]
})
export class SharedModule { }
