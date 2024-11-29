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
    private authService: BaseAuthenticationService ,
    private loadingController: LoadingController,
    private popoverController: PopoverController

  ) {
    // Verifica si el usuario está autenticado
    
  }

  async onItemClick() {
    // Tu lógica de navegación aquí.
    if (this.isLoggedIn) {
      // Redirigir a la página de perfil.
      this.goToProfile()
    } else {
      // Redirigir a la página de inicio de sesión.
      this.goToLogin()
    }
    // Cerrar el popover.
    await this.popoverController.dismiss();
  }

  goToProfile() {
    this.navCtrl.navigateForward('/profile');  // Redirige al perfil
  }

  goToLogin() {
    this.navCtrl.navigateForward('/login');  // Redirige al login
  }
}
