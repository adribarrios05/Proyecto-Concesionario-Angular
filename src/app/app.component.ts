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

/**
 * Componente raíz de la aplicación. Gestiona la navegación,
 * autenticación, cambio de idioma y visibilidad de la barra de navegación.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  /**
   * Indica si se debe mostrar la barra de navegación.
   */
  showNavbar: boolean = true;

  /**
   * Indica si hay un usuario logueado.
   */
  isLoggedIn: boolean = false;

  /**
   * URL actual de la imagen de perfil.
   */
  profileImageUrl: string = '';

  /**
   * Observable que emite cambios en la imagen de perfil del usuario.
   */
  private _profileImage = new BehaviorSubject<string>(
    'https://ionicframework.com/docs/img/demos/avatar.svg'
  );
  profileImage$ = this._profileImage.asObservable();

  /**
   * Lista completa de páginas del menú.
   */
  public allAppPages = [
    { title: 'HOME', url: '/home', icon: 'home' },
    { title: 'INVENTORY', url: '/inventory', icon: 'file-tray-full' },
    { title: 'SALES_HISTORY', url: '/sales', icon: 'cash' },
    { title: 'CUSTOMERS-PAGE', url: '/customers', icon: 'people' },
    { title: 'ABOUT-US-PAGE', url: '/about-us', icon: 'information-circle' },
  ];

  /**
   * Páginas visibles en el menú, dependiendo del rol del usuario.
   */
  appPages = this.allAppPages;

  /**
   * Roles del usuario autenticado.
   */
  userRole: string[] = [];

  /**
   * Datos del cliente logueado, si existen.
   */
  customer: Customer | null = null;

  /**
   * Constructor principal del componente.
   * @param router Router de Angular
   * @param popoverController Controlador de popovers de Ionic
   * @param translateSvc Servicio de traducción
   * @param authSvc Servicio de autenticación base
   * @param customerSvc Servicio para cargar datos del cliente
   */
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

  /**
   * Inicializa el componente y suscriptores.
   */
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

  /**
   * Carga la imagen de perfil del usuario desde Firebase.
   * @param userId ID del usuario logueado
   */
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

  /**
   * Restaura la imagen de perfil a la predeterminada.
   */
  resetProfileImage() {
    console.log('⚠️ No hay usuario logueado, usando imagen predeterminada.');
    this.isLoggedIn = false;
    this._profileImage.next(
      'https://ionicframework.com/docs/img/demos/avatar.svg'
    );
  }

  /**
   * Actualiza manualmente la imagen de perfil en el navbar.
   * @param imageUrl Nueva URL de imagen
   */
  updateNavbarProfileImage(imageUrl: string) {
    console.log('🔄 Imagen actualizada en Navbar:', imageUrl);
    this._profileImage.next(imageUrl);
  }

  /**
   * Muestra el popover del perfil.
   * @param event Evento de clic o interacción
   */
  async presentPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: ProfilePopoverComponent,
      event: event,
      translucent: true,
    });
    return await popover.present();
  }

  /**
   * Muestra el popover de selección de idioma.
   * @param event Evento de clic o interacción
   */
  async presentLanguagePopover(event: Event) {
    const popover = await this.popoverController.create({
      component: LanguagePopoverComponent,
      event: event,
      translucent: true,
    });
    await popover.present();
  }

  /**
   * Filtra las páginas visibles en el menú según el rol.
   * @param role Lista de roles del usuario
   */
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
