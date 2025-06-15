import { Component, Inject, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerModalComponent } from 'src/app/components/customer-modal/customer-modal.component';
import { User } from 'src/app/core/models/auth.model';
import { Customer } from 'src/app/core/models/customer.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { CUSTOMER_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.tokens';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import {
  ICollectionSubscription,
  CollectionChange,
} from 'src/app/core/services/interfaces/collection-subscription.interface';

/**
 * Página que muestra la lista de clientes, con funcionalidad de scroll infinito,
 * gestión en tiempo real mediante suscripciones y edición a través de un modal.
 */
@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  /** Lista reactiva de clientes */
  _customers: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);
  /** Observable público para suscribirse a los clientes */
  customers$: Observable<Customer[]> = this._customers.asObservable();

  /** Lista reactiva de usuarios (no se usa en esta implementación) */
  _users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this._users.asObservable();

  /** Indica si se está usando un dispositivo móvil */
  isMobile: boolean = false;

  /** IDs de clientes ya cargados para evitar duplicados al suscribirse */
  private loadedIds: Set<string> = new Set();

  /** Página actual de paginación */
  page: number = 1;

  /** Tamaño de página para la paginación */
  pageSize: number = 20;

  /** Número total de páginas disponibles */
  pages: number = 0;

  constructor(
    private customerService: CustomerService,
    private modalCtrl: ModalController,
    private platform: Platform,
    @Inject(CUSTOMER_COLLECTION_SUBSCRIPTION_TOKEN)
    private customerSubscription: ICollectionSubscription<Customer>
  ) {}

  /**
   * Inicializa la página, detecta el tamaño de pantalla y carga los clientes.
   */
  ngOnInit() {
    this.isMobile = window.innerWidth <= 1011;

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 1011;
    });

    this.loadCustomers();

    // 🔁 Suscripción en tiempo real a cambios en la colección de clientes
    this.customerSubscription
      .subscribe('customers')
      .subscribe((change: CollectionChange<Customer>) => {
        const currentCustomers = [...this._customers.value];

        if (!this.loadedIds.has(change.id) && change.type !== 'added') return;

        switch (change.type) {
          case 'added':
          case 'modified':
            const index = currentCustomers.findIndex((p) => p.id === change.id);
            if (index >= 0) {
              currentCustomers[index] = change.data!;
            }
            break;
          case 'removed':
            const removeIndex = currentCustomers.findIndex(
              (p) => p.id === change.id
            );
            if (removeIndex >= 0) {
              currentCustomers.splice(removeIndex, 1);
              this.loadedIds.delete(change.id);
            }
            break;
        }

        this._customers.next(currentCustomers);
      });
  }

  /**
   * Carga los clientes desde la API y actualiza la lista observable.
   */
  loadCustomers() {
    this.page = 1;
    this.customerService
      .getAll(this.page, this.pageSize, {}, 'name')
      .subscribe({
        next: (response: Paginated<Customer>) => {
          console.log('Datos obtenidos de la API:', response.data);

          response.data.forEach((customer) => this.loadedIds.add(customer.id));
          this._customers.next(response.data);

          this.page++;
          this.pages = response.pages;

          this._customers.subscribe((data) => {
            console.log('Datos actualizados en _customers:', data);
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  /**
   * Carga más clientes cuando se activa el scroll infinito.
   * @param notify Elemento del scroll infinito de Ionic
   */
  loadMoreCustomers(notify: HTMLIonInfiniteScrollElement | null = null) {
    if (this.page <= this.pages) {
      this.customerService.getAll(this.page, this.pageSize).subscribe({
        next: (response: Paginated<Customer>) => {
          response.data.forEach((customer) => this.loadedIds.add(customer.id));
          this._customers.next([...this._customers.value, ...response.data]);
          this.page++;
          notify?.complete();
        },
      });
    } else {
      notify?.complete();
    }
  }

  /**
   * Handler del evento ionInfinite.
   * @param ev Evento de scroll infinito
   */
  onIonInfinite(ev: any) {
    this.loadMoreCustomers(ev.target);
  }

  /**
   * Abre un modal para editar o eliminar un cliente.
   * @param customer Cliente a editar
   */
  async openCustomerModal(customer: Customer) {
    const modal = await this.modalCtrl.create({
      component: CustomerModalComponent,
      componentProps: { customer },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const { action, data } = result.data;
        if (action === 'save') {
          this.updateCustomer(customer.id, data);
        } else if (action === 'delete') {
          this.deleteCustomer(customer.id);
        }
      }
    });

    await modal.present();
  }

  /**
   * Actualiza los datos de un cliente.
   * @param id ID del cliente
   * @param data Datos modificados
   */
  updateCustomer(id: string, data: any) {
    this.customerService.update(id.toString(), data).subscribe({
      next: () => this.loadCustomers(),
      error: (err) => console.error(err),
    });
  }

  /**
   * Elimina un cliente por ID.
   * @param id ID del cliente
   */
  deleteCustomer(id: string) {
    this.customerService.delete(id.toString()).subscribe({
      next: () => this.loadCustomers(),
      error: (err) => console.error(err),
    });
  }

  /**
   * Obtiene la URL del avatar o imagen del cliente.
   * @param customer Cliente a mostrar
   * @returns URL de la imagen o imagen por defecto
   */
  getCustomerThumbnail(customer: Customer): string {
    const picture = customer.picture;
    if (typeof picture === 'object') {
      return (
        picture.thumbnail ||
        'https://ionicframework.com/docs/img/demos/avatar.svg'
      );
    }
    return picture || 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }
}
