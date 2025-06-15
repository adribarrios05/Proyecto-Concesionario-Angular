import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ProfilePopoverComponent } from './components/profile-popover/profile-popover.component';
import { LanguagePopoverComponent } from './components/language-popover/language-popover.component';
import { TranslateService } from '@ngx-translate/core';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { CustomerService } from './core/services/impl/customer.service';
import { BehaviorSubject } from 'rxjs';
import { Customer } from './core/models/customer.model';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  showNavbar: boolean = true;
  isLoggedIn: boolean = false;
  profileImageUrl: string = '';
  private _profileImage = new BehaviorSubject<string>(
    'https://ionicframework.com/docs/img/demos/avatar.svg'
  );
  profileImage$ = this._profileImage.asObservable();

  public allAppPages = [
    { title: 'HOME', url: '/home', icon: 'home' },
    { title: 'INVENTORY', url: '/inventory', icon: 'file-tray-full' },
    { title: 'SALES_HISTORY', url: '/sales', icon: 'cash' },
    { title: 'CUSTOMERS-PAGE', url: '/customers', icon: 'people' },
    { title: 'ABOUT-US-PAGE', url: '/about-us', icon: 'information-circle' },
  ];
  appPages = this.allAppPages;

  userRole: string[] = [];
  customer: Customer | null = null;

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private translateSvc: TranslateService,
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService
  ) {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.translateSvc.setDefaultLang(savedLanguage);
    this.translateSvc.use(savedLanguage);
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.showNavbar =
          !currentRoute.includes('/login') &&
          !currentRoute.includes('/register');
      }
    });

    this.authSvc.authState$.subscribe({
      next: (user) => {
        if (user) {
          console.log('✅ Usuario detectado:', user);
          this.isLoggedIn = true;
          this.loadUserProfileImage(user.id);

          this.customerSvc.getById(user.id).subscribe({
            next: (customer) => {
              if (customer) {
                console.log('🧠 Customer cargado:', customer);
                this.customer = customer;
              } else {
                console.warn('⚠️ No se encontró Customer para este user');
                this.customer = null;
              }
            },
            error: (err) => {
              console.error('❌ Error al cargar customer:', err);
              this.customer = null;
            },
          });
        } else {
          console.log('⚠️ No hay usuario logueado');
          this.isLoggedIn = false;
          this.resetProfileImage();
          this.customer = null;
        }
      },
      error: (error) => {
        console.log('❌ Error detectando usuario:', error);
        this.resetProfileImage();
      },
    });
  }

  loadUserProfileImage(userId: string) {
    this.customerSvc.getById(userId).subscribe({
      next: (customer) => {
        let imageUrl = '';
        if (customer) {
          imageUrl =
            typeof customer.picture === 'string'
              ? customer.picture
              : customer.picture?.url ||
                'https://ionicframework.com/docs/img/demos/avatar.svg';
        }

        console.log('🔄 Imagen de perfil cargada:', imageUrl);
        this._profileImage.next(imageUrl);
      },
      error: () => {
        this.resetProfileImage();
      },
    });
  }

  resetProfileImage() {
    console.log('⚠️ No hay usuario logueado, usando imagen predeterminada.');
    this.isLoggedIn = false;
    this._profileImage.next(
      'https://ionicframework.com/docs/img/demos/avatar.svg'
    );
  }

  updateNavbarProfileImage(imageUrl: string) {
    console.log('🔄 Imagen actualizada en Navbar:', imageUrl);
    this._profileImage.next(imageUrl);
  }

  async presentPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: ProfilePopoverComponent,
      event: event,
      translucent: true,
    });
    return await popover.present();
  }

  async presentLanguagePopover(event: Event) {
    const popover = await this.popoverController.create({
      component: LanguagePopoverComponent,
      event: event,
      translucent: true,
    });
    await popover.present();
  }

  setRoleBasedPages(role: string[]) {
    if (role?.includes('customer')) {
      this.appPages = this.allAppPages.filter(
        (p) => !['/customers', '/sales-history'].includes(p.url)
      );
    } else {
      this.appPages = this.allAppPages;
    }
  }
}
