import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { LoadingController, NavController, PopoverController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Customer } from 'src/app/core/models/customer.model';
import { CustomerStrapiRepositoryService } from 'src/app/core/repositories/impl/customer-strapi-repository.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { StrapiAuthenticationService } from 'src/app/core/services/impl/strapi-authentication.service';

@Component({
  selector: 'app-profile-popover',
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.scss']
})
export class ProfilePopoverComponent implements OnInit{

  customer?: Customer | null
  isLoggedIn: boolean = false;  
  profileImage: string = ""

  constructor(
    private navCtrl: NavController,
    private popoverController: PopoverController,  
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService
  ) {
    console.log("AuthSvc", authSvc)
  }

  async ngOnInit() {
    try {
      const user = await this.authSvc.getCurrentUser();
      console.log("User: ", user)
      if(user){
        this.customer = await lastValueFrom(this.customerSvc.getByUserId(user.id))
        console.log("Customer: ", this.customer)
        
        console.log("Hay un cliente logueado: ", this.customer)
        this.isLoggedIn = true
        this.profileImage = user.picture?.url || 'https://ionicframework.com/docs/img/demos/avatar.svg';
      }
    } catch {
      console.log("No hay un cliente logueado")
      this.profileImage = 'https://ionicframework.com/docs/img/demos/avatar.svg';
    }
  }

  async onItemClick() {

    if (this.isLoggedIn && this.customer) {
      this.navCtrl.navigateForward('/profile'); 
    } else {
      this.navCtrl.navigateForward('/login'); 
    }
    await this.popoverController.dismiss();
  }
}
