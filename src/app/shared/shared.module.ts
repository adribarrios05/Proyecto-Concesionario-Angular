import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideMenuComponent } from '../components/side-menu/side-menu.component';
import { ProfilePopoverComponent } from '../components/profile-popover/profile-popover.component';
import { CarModalComponent } from '../components/car-modal/car-modal.component';
import { PictureSelectableComponent } from '../components/picture-selectable/picture-selectable.component';



@NgModule({
  declarations: [
    SideMenuComponent,
    ProfilePopoverComponent,
    CarModalComponent,
    PictureSelectableComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    IonicModule,
    SideMenuComponent,
    ProfilePopoverComponent,
    CarModalComponent,
    PictureSelectableComponent,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
