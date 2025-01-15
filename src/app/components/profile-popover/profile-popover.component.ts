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
    private customerRepository: CustomerStrapiRepositoryService,
    private customerSvc: CustomerService
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authSvc.getCurrentUser();
      if(user && user!=null){
        this.customer = await lastValueFrom(this.customerSvc.getByUserId(user.id))
        console.log("Hay un cliente logueado: ", this.customer)
        this.isLoggedIn = true
      }
    } catch {
      console.log("No hay un cliente logueado")
    }
  }

  loadCustomerData(customerId: number) {
    this.customerRepository.getCustomerWithUser(customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.profileImage = customer.picture?.url || 'https://ionicframework.com/docs/img/demos/avatar.svg'
      },
      error: (err) => {
        console.error("Error al cargar el cliente: ", err)
        this.profileImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxRWPsrqnTimFNyfNHYDME6x-V9hT1foBnMlg2JANOAMUQj1fqpI7e6xhP_Uh9j90t-yU&usqp=CAU'
      }
    })
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
