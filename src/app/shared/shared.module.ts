import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideMenuComponent } from '../components/side-menu.backup/side-menu.component';
import { ProfilePopoverComponent } from '../components/profile-popover/profile-popover.component';
import { CarModalComponent } from '../components/car-modal/car-modal.component';
import { PictureSelectableComponent } from '../components/picture-selectable/picture-selectable.component';
import { BaseAuthenticationService } from '../core/services/impl/base-authentication.service';
import { StrapiAuthenticationService } from '../core/services/impl/strapi-authentication.service';
import { LanguagePopoverComponent } from '../components/language-popover/language-popover.component';
import { TranslateModule } from '@ngx-translate/core';
import { PriceFormatDirective } from './directives/price-format.directive';
import { CustomerModalComponent } from '../components/customer-modal/customer-modal.component';
import { ProfileImgModalComponent } from '../components/profile-img-modal/profile-img-modal.component';



@NgModule({
  declarations: [
    SideMenuComponent,
    ProfilePopoverComponent,
    CarModalComponent,
    PictureSelectableComponent,
    LanguagePopoverComponent,
    PriceFormatDirective,
    CustomerModalComponent,
    ProfileImgModalComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  providers: [
  ],
  exports: [
    CommonModule,
    IonicModule,
    SideMenuComponent,
    ProfilePopoverComponent,
    CarModalComponent,
    PictureSelectableComponent,
    LanguagePopoverComponent,
    CustomerModalComponent,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    PriceFormatDirective,
    ProfileImgModalComponent
  ]
})
export class SharedModule { }
