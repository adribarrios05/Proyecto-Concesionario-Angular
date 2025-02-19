import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ProfilePopoverComponent } from './components/profile-popover/profile-popover.component';
import { LanguagePopoverComponent } from './components/language-popover/language-popover.component';
import { TranslateService } from '@ngx-translate/core';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { CustomerService } from './core/services/impl/customer.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  showNavbar: boolean = true;
  isLoggedIn: boolean = false; 
  profileImageUrl: string = ''; 

  public appPages = [
    { title: 'HOME', url: '/home', icon: 'home' },
    { title: 'INVENTORY', url: '/inventory', icon: 'file-tray-full' },
    { title: 'SALES_HISTORY', url: '/sales', icon: 'cash' },
    { title: 'CUSTOMERS-PAGE', url: '/customers', icon: 'people' },
  ];
  
  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private translateSvc: TranslateService,
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService,

  ) {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.translateSvc.setDefaultLang(savedLanguage);
    this.translateSvc.use(savedLanguage);

    this.checkUserAuthentication()
  }

  ngOnInit(){
    this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      const currentRoute = this.router.url;
      if (currentRoute.includes('/login') || currentRoute.includes('/register')) {
        this.showNavbar = false;
      } else {
        this.showNavbar = true;
      }
    }
  });
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: ProfilePopoverComponent,
      event: event,
      translucent: true
    });
    return await popover.present()
  }

  async presentLanguagePopover(event: Event) {
    const popover = await this.popoverController.create({
      component: LanguagePopoverComponent,
      event: event,
      translucent: true
    });
    await popover.present();
  }

  private checkUserAuthentication() {
    console.log("AuthSvc: ", this.authSvc)
    this.authSvc.me().subscribe({
      next: (user) => {
        if (user?.id) {
          this.customerSvc.getByUserId(user.id).subscribe({
            next: (customer) => {
              this.isLoggedIn = true;
              this.profileImageUrl = customer?.picture?.url || 'https://ionicframework.com/docs/img/demos/avatar.svg';
            },
            error: () => {
              console.error('Error al obtener el cliente');
              this.isLoggedIn = false;
              this.profileImageUrl = 'https://ionicframework.com/docs/img/demos/avatar.svg';
            },
          });
        } else {
          console.error('El usuario autenticado no tiene un ID');
          this.isLoggedIn = false;
          this.profileImageUrl = 'https://ionicframework.com/docs/img/demos/avatar.svg';
        }
      },
      error: () => {
        console.error('Error al obtener el usuario autenticado');
        this.isLoggedIn = false;
        this.profileImageUrl = 'https://ionicframework.com/docs/img/demos/avatar.svg';
      },
    });
  }
}
