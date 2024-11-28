import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SideMenuComponent } from '../components/side-menu/side-menu.component';
import { ProfilePopoverComponent } from '../components/profile-popover/profile-popover.component';



@NgModule({
  declarations: [
    SideMenuComponent,
    ProfilePopoverComponent
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
    ProfilePopoverComponent,
    FormsModule,
    RouterModule
  ]
})
export class SharedModule { }
