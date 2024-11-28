import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
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

  ) {
    // Verifica si el usuario está autenticado
    
  }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const user = await this.authService.getCurrentUser();
      if(user){
          this.isLoggedIn = true
      }
    } catch (error) {
      console.error(error);
    } finally {
      await loading.dismiss();
    }
  }

  goToProfile() {
    this.navCtrl.navigateForward('/profile');  // Redirige al perfil
  }

  goToLogin() {
    this.navCtrl.navigateForward('/login');  // Redirige al login
  }
}
