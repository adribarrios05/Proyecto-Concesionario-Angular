import { Component } from '@angular/core';
import { LoadingController, NavController, PopoverController } from '@ionic/angular';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { StrapiAuthenticationService } from 'src/app/core/services/impl/strapi-authentication.service';

@Component({
  selector: 'app-profile-popover',
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.scss']
})
export class ProfilePopoverComponent {

  isLoggedIn: boolean = false;  

  constructor(
    private navCtrl: NavController,
    private popoverController: PopoverController

  ) {
    // Verifica si el usuario está autenticado
    
  }

  async onItemClick() {

    if (this.isLoggedIn) {
      //this.navCtrl.navigateForward('/profile'); 
    } else {
      this.navCtrl.navigateForward('/login'); 
    }
    await this.popoverController.dismiss();
  }
}
