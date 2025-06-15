import {
  Component,
  Directive,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AlertController,
  ModalController,
  Platform,
  RangeCustomEvent,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Car } from 'src/app/core/models/car.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { CarService } from 'src/app/core/services/impl/car.service';
import {
  InfiniteScrollCustomEvent,
  RangeValue,
  toastController,
} from '@ionic/core';
import { CarModalComponent } from 'src/app/components/car-modal/car-modal.component';
import { SearchParams } from 'src/app/core/repositories/intefaces/base-repository.interface';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import {
  CollectionChange,
  ICollectionSubscription,
} from 'src/app/core/services/interfaces/collection-subscription.interface';
import { CAR_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.tokens';
import { Customer } from 'src/app/core/models/customer.model';
import jsPDF from 'jspdf';
import { Directory, Encoding } from '@capacitor/filesystem';
import { Filesystem } from '@capacitor/filesystem';
import { FirebaseCustomer } from 'src/app/core/models/firebase/firebase-customer.model';
import { FirebaseCar } from 'src/app/core/models/firebase/firebase-car.model';
import { FilePicker } from '@capawesome/capacitor-file-picker';

/**
 * Componente de la página de inventario. Permite listar, filtrar, comprar y eliminar coches.
 * También genera un contrato en PDF al realizar una compra.
 */
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: false,
})
export class InventoryPage implements OnInit {
  /**
   * Evento emitido cuando se cambian los filtros desde el componente.
   */
  @Output() filterChange = new EventEmitter<any>();

  /**
   * Referencia al componente de scroll infinito (Ionic).
   */
  @ViewChild('infiniteScroll', { static: false })
  infiniteScroll?: any;

  /**
   * Filtro de caballos de potencia.
   */
  horsePower: RangeValue = { lower: 200, upper: 1600 };

  /**
   * Filtro de precio.
   */
  price: RangeValue = { lower: 50000, upper: 3500000 };

  /**
   * Marcas de coches seleccionadas como filtro.
   */
  marcasSeleccionadas: string[] = [];

  /**
   * BehaviorSubject que contiene los coches actualmente visibles.
   */
  _cars: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>([]);

  /**
   * Observable expuesto de los coches visibles.
   */
  cars$: Observable<Car[]> = this._cars.asObservable();

  /**
   * Indica si el usuario ha iniciado sesión.
   */
  isLoggedIn: boolean = false;

  /**
   * IDs de coches ya cargados (para evitar duplicados).
   */
  private loadedIds: Set<string> = new Set();

  /**
   * Indica si se están mostrando los filtros.
   */
  showFilters: boolean = false;

  /**
   * Filtros activos para buscar coches.
   */
  activeFilters: SearchParams = {};

  /**
   * Cliente asociado al usuario autenticado.
   */
  customer: Customer | null = null;

  /**
   * Consulta de búsqueda libre (marca, modelo...).
   */
  searchQuery: string = '';

  /**
   * Todos los coches cargados (sin filtros), usados para búsquedas locales.
   */
  allCars: Car[] = [];

  /**
   * Constructor del componente InventoryPage.
   * @param modalCtrl Controlador de modales de Ionic.
   * @param carSvc Servicio de coches.
   * @param authSvc Servicio de autenticación.
   * @param customerSvc Servicio de clientes.
   * @param alertController Controlador de alertas.
   * @param carSubscription Suscripción a cambios en la colección de coches.
   */
  constructor(
    private modalCtrl: ModalController,
    private carSvc: CarService,
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService,
    private alertController: AlertController,
    @Inject(CAR_COLLECTION_SUBSCRIPTION_TOKEN)
    private carSubscription: ICollectionSubscription<Car>
  ) {}

  /**
   * Hook de inicialización. Carga datos del usuario, suscripción a cambios y filtros iniciales.
   */
  ngOnInit() {
    this.authSvc.me().subscribe({
      next: (user) => {
        if (user) {
          console.log('✅ Usuario logueado:', user);
          this.isLoggedIn = true;

          // 🔄 Cargar el customer vinculado a este user
          this.customerSvc.getById(user.id).subscribe({
            next: (customer) => {
              if (customer) {
                console.log('👤 Customer cargado:', customer);
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
          console.log('🚨 No hay usuario logueado.');
          this.isLoggedIn = false;
          this.customer = null;
        }
      },
      error: (e) => {
        console.log('❌ Error al obtener usuario:', e);
        this.isLoggedIn = false;
        this.customer = null;
      },
    });

    this.applyFilters();

    this.carSubscription
      .subscribe('cars')
      .subscribe((change: CollectionChange<Car>) => {
        const currentCars = [...this._cars.value];

        // Solo procesar cambios de documentos que ya tenemos cargados
        if (!this.loadedIds.has(change.id) && change.type !== 'added') {
          return;
        }

        switch (change.type) {
          case 'added':
          case 'modified':
            const index = currentCars.findIndex((p) => p.id === change.id);
            if (index >= 0) {
              currentCars[index] = change.data!;
            }
            break;
          case 'removed':
            const removeIndex = currentCars.findIndex(
              (p) => p.id === change.id
            );
            if (removeIndex >= 0) {
              currentCars.splice(removeIndex, 1);
              this.loadedIds.delete(change.id);
            }
            break;
        }
        this._cars.next(currentCars);
      });
  }

  /**
   * Página actual para la paginación.
   */
  page: number = 1;

  /**
   * Número de elementos por página.
   */
  pageSize: number = 4;

  /**
   * Número total de páginas (calculado desde backend).
   */
  pages: number = 0;

  /**
   * Indica si se están cargando coches actualmente.
   */
  isLoading: boolean = true;

  /**
   * Carga la siguiente página de resultados, manteniendo los filtros activos.
   * @param event Evento opcional de scroll infinito (Ionic).
   */
  loadNextPage(event?: Event): void {
    console.log(
      `📦 Cargando página ${this.page} con filtros:`,
      this.activeFilters
    );

    this.carSvc
      .getAll(this.page, this.pageSize, this.activeFilters, 'brand')
      .subscribe({
        next: (res) => {
          const newCars = res.data.filter((c) => !this.loadedIds.has(c.id));
          newCars.forEach((c) => this.loadedIds.add(c.id));
          const merged = [...this._cars.value, ...newCars];
          this._cars.next(merged);

          console.log(
            `✅ Página ${this.page} cargada. Coches nuevos:`,
            newCars
          );
          this.page++;

          if (
            event &&
            'target' in event &&
            event.target &&
            'complete' in event.target
          ) {
            const target = event.target as any;
            if (typeof target.complete === 'function') {
              target.complete();
            }
          }
        },
        error: (err) => {
          console.error('❌ Error al cargar página:', err);
        },
      });
  }

  /**
   * Verifica si un valor es un rango válido con propiedades `lower` y `upper`.
   * @param value Valor a comprobar
   * @returns True si es un rango válido, False en caso contrario
   */
  isRangeValue(value: RangeValue): value is { lower: number; upper: number } {
    return typeof value === 'object' && 'lower' in value && 'upper' in value;
  }

  /**
   * Aplica los filtros seleccionados, reinicia la paginación y actualiza la lista de coches mostrados.
   */
  applyFilters(): void {
    console.log('🔍 Aplicando filtros...');
    this.page = 1;
    this.pages = 0;
    this.loadedIds.clear();
    this._cars.next([]);
    this.activeFilters = this.buildFilters();

    if (this.searchQuery.trim()) {
      this.activeFilters['search'] = this.searchQuery.toLowerCase();
    }

    setTimeout(() => {
      this.infiniteScroll!.disabled = false;
      console.log('♻️ Infinite Scroll reactivado tras aplicar filtros.');
      this.loadNextPage();
    });
  }

  /**
   * Restaura los filtros a sus valores por defecto y aplica los cambios.
   */
  resetFilters(): void {
    console.log('🔄 Reseteando filtros...');
    this.horsePower = { lower: 200, upper: 1600 };
    this.price = { lower: 50000, upper: 3500000 };
    this.marcasSeleccionadas = [];
    this.applyFilters();
  }

  /**
   * Construye los filtros de búsqueda activos según los rangos y marcas seleccionadas.
   * @returns Objeto con los parámetros de búsqueda a aplicar
   */
  buildFilters(): SearchParams {
    const filters: any = { customer: null };

    if (
      this.isRangeValue(this.horsePower) &&
      (this.horsePower.lower !== 200 || this.horsePower.upper !== 1600)
    ) {
      filters.horsePower = {
        $gte: this.horsePower.lower,
        $lte: this.horsePower.upper,
      };
    }

    if (
      this.isRangeValue(this.price) &&
      (this.price.lower !== 50000 || this.price.upper !== 3500000)
    ) {
      filters.price = { $gte: this.price.lower, $lte: this.price.upper };
    }

    if (this.marcasSeleccionadas.length > 0) {
      filters.brand = { $in: this.marcasSeleccionadas };
    }

    return filters;
  }

  /**
   * Evento al cambiar el rango de caballos de potencia. Aplica nuevos filtros.
   * @param ev Evento del ion-range
   */
  onCaballosChange(ev: any): void {
    this.horsePower = ev.detail.value;
    this.applyFilters();
  }

  /**
   * Evento al cambiar el rango de precio. Aplica nuevos filtros.
   * @param ev Evento del ion-range
   */
  onPrecioChange(ev: any): void {
    this.price = ev.detail.value;
    this.applyFilters();
  }

  /**
   * Evento al seleccionar o deseleccionar una marca para el filtro.
   * @param ev Evento del ion-checkbox
   * @param marca Marca seleccionada o deseleccionada
   */
  onMarcaChange(ev: any, marca: string) {
    if (ev.detail.checked) {
      this.marcasSeleccionadas.push(marca);
    } else {
      this.marcasSeleccionadas = this.marcasSeleccionadas.filter(
        (m) => m !== marca
      );
    }
    this.applyFilters();
  }

  /**
   * Evento del Infinite Scroll que carga la siguiente página de resultados.
   * @param event Evento del scroll infinito
   */
  onIonInfinite(event: InfiniteScrollCustomEvent) {
    console.log('Scrolleando...');
    this.loadNextPage(event);
  }

  /**
   * Abre un modal para crear un nuevo coche. Al cerrar, guarda el coche si se ha enviado correctamente.
   */
  async openCarModal() {
    const modal = await this.modalCtrl.create({
      component: CarModalComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        let { carData } = result.data;

        // Normaliza el campo picture
        if (carData.picture) {
          if (typeof carData.picture === 'string') {
            console.log('✅ Imagen en string:', carData.picture);
          } else if (
            typeof carData.picture === 'object' &&
            carData.picture.url
          ) {
            console.log(
              '✅ Imagen en objeto, extrayendo URL:',
              carData.picture.url
            );
            carData.picture = carData.picture.url;
          } else {
            console.warn('⚠️ Imagen en formato desconocido:', carData.picture);
            carData.picture = '';
          }
        } else {
          console.warn(
            '⚠️ No se ha asignado imagen al coche antes de enviarlo.'
          );
        }

        console.log('✅ Guardando coche con imagen final:', carData.picture);

        this.carSvc.add(carData).subscribe(() => {
          console.log('✅ Imagen vinculada correctamente:', carData.picture);
          this.applyFilters();
        });
      }
    });

    await modal.present();
  }

  /**
   * Acción al pulsar "comprar" en un coche. Muestra confirmación si el usuario está autenticado.
   * @param car Coche seleccionado para compra
   */
  onBuy(car: Car) {
    if (this.isLoggedIn) {
      this.presentConfirmAlert(car);
    } else {
      console.error('El usuario no está autenticado');
    }
  }

  /**
   * Muestra un alert de confirmación antes de realizar la compra del coche.
   * @param car Coche seleccionado para comprar
   */
  async presentConfirmAlert(car: Car) {
    const alert = await this.alertController.create({
      header: 'Confirmar Compra',
      message: `¿Está seguro de que desea comprar el ${car.brand} ${car.model}?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-cancel-btn',
          handler: () => {
            console.log('Compra cancelada');
          },
        },
        {
          text: 'Sí',
          cssClass: 'alert-confirm-btn',
          handler: () => {
            this.processPurchase(car);
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Realiza el proceso de compra del coche, actualizando su propiedad `customer`.
   * @param car Coche a comprar
   */
  processPurchase(car: Car) {
    this.authSvc.me().subscribe({
      next: (user) => {
        if (!user || (!user.id && !user.uid)) {
          console.error('Error: Usuario no encontrado o sin id: ', [
            user,
            user.id,
            user.uid,
          ]);
          return;
        }

        const _userId = user.id || user.uid;
        console.log('Usuario autenticado: ', [
          user,
          user.id,
          user.uid,
          user.email,
        ]);
        console.log('🔎 Buscando cliente con userId:', _userId);

        this.customerSvc.getById(_userId).subscribe({
          next: (customer) => {
            console.log('Customer: ', customer);
            if (!customer || !customer.id) {
              console.error(
                `❌ No se encontró un cliente asociado al usuario con UID: ${user.uid}`
              );
              return;
            }

            console.log('✅ Cliente encontrado:', [customer, customer.id]);
            console.log('Car antes de updatearlo: ', car);

            const updatedCar = { ...car, customer: customer.id };
            console.log('🚀 Actualizando coche con:', [
              updatedCar,
              updatedCar.customer,
            ]);

            this.carSvc.update(updatedCar.id, updatedCar).subscribe({
              next: () => {
                console.log(
                  `Coche ${car.brand} ${car.model} comprado con éxito por el cliente ${customer.name}. Id: ${car.customer}`
                );
                this.generateContract(updatedCar, customer);
                this.applyFilters();
              },
              error: (err) => {
                console.error('Error al comprar el coche:', err);
              },
            });
          },
          error: (err) => {
            console.error('Error al obtener el cliente:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error al verificar la sesión:', err);
      },
    });
  }

  /**
   * Inicia el proceso de eliminación de un coche mostrando un alert de confirmación.
   * @param car Coche a eliminar
   */
  onDelete(car: Car) {
    this.presentDeleteConfirmAlert(car);
  }

  /**
   * Muestra un alert para confirmar la eliminación del coche.
   * @param car Coche a eliminar
   */
  async presentDeleteConfirmAlert(car: Car) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro de que desea eliminar el coche ${car.brand} ${car.model}?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-cancel-btn',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Sí',
          cssClass: 'alert-confirm-btn',
          handler: () => {
            this.deleteCar(car);
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Elimina el coche especificado de la base de datos.
   * @param car Coche a eliminar
   */
  deleteCar(car: Car) {
    this.carSvc.delete(car.id).subscribe({
      next: () => {
        console.log(`Coche ${car.brand} ${car.model} eliminado con éxito.`);
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error al eliminar el coche:', err);
      },
    });
  }

  /**
   * Genera un contrato de compra en formato PDF para el coche y cliente especificados.
   * El contrato incluye datos del vehículo, cliente, condiciones y espacio para firmas.
   * @param car Objeto del coche adquirido
   * @param customer Objeto del cliente comprador
   */
  async generateContract(
    car: Car | FirebaseCar,
    customer: Customer | FirebaseCustomer
  ) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 📌 Logo de la empresa
    const logoUrl = '../../../../assets/icon/favicon.png'; // 🔹 Cambia por la URL de tu logo
    const logoWidth = 40;
    const logoHeight = 40;
    doc.addImage(logoUrl, 'PNG', pageWidth - 60, 10, logoWidth, logoHeight);

    // 📌 Encabezado del contrato
    doc.setFontSize(18);
    doc.text('CONTRATO DE COMPRA DE VEHÍCULO', 20, 30);
    doc.setFontSize(12);
    doc.text('Concesionarios BaCa S.A.', 20, 40);
    doc.text(
      'Dirección: Calle Frederic Therman 3, Campanillas, Málaga',
      20,
      50
    );
    doc.text(
      'Teléfono: +34 900 123 456 | Email: contacto@concesionariosbaca.com',
      20,
      60
    );
    doc.line(20, 65, pageWidth - 20, 65);

    // 📌 Datos del Cliente
    doc.setFontSize(14);
    doc.text('Datos del Cliente:', 20, 75);
    doc.setFontSize(12);
    doc.text(`Nombre: ${customer.name} ${customer.surname}`, 20, 85);
    doc.text(`DNI: ${customer.dni}`, 20, 95);
    doc.text(`Teléfono: ${customer.phone}`, 20, 105);
    doc.line(20, 120, pageWidth - 20, 120);

    // 📌 Datos del Vehículo
    doc.setFontSize(14);
    doc.text('Datos del Vehículo:', 20, 130);
    doc.setFontSize(12);
    doc.text(`Marca: ${car.brand}`, 20, 140);
    doc.text(`Modelo: ${car.model}`, 20, 150);
    doc.text(`Matrícula: ${car.plate}`, 20, 160);
    doc.text(`Precio: ${car.price} €`, 20, 170);
    doc.text(`Color: ${car.color}`, 20, 180);
    doc.text(`Caballos de potencia: ${car.horsePower} HP`, 20, 190);
    doc.line(20, 195, pageWidth - 20, 195);

    // 📌 Términos y Condiciones
    doc.setFontSize(14);
    doc.text('Términos y Condiciones:', 20, 205);
    doc.setFontSize(10);
    const termsText = `Este contrato de compra establece los términos y condiciones bajo los cuales el cliente 
    adquiere el vehículo mencionado anteriormente. El vehículo cuenta con una garantía de 2 años cubriendo 
    defectos de fabricación. La empresa no se hace responsable de daños por uso indebido.`;
    doc.text(termsText, 20, 215, {
      maxWidth: pageWidth - 40,
      align: 'justify',
    });

    doc.setFontSize(10);
    const extraConditions = `El cliente acepta las condiciones de compra, incluyendo el pago completo antes de la 
    entrega del vehículo y la obligación de cumplir con los requisitos legales para su uso en la vía pública.`;
    doc.text(extraConditions, 20, 230, {
      maxWidth: pageWidth - 40,
      align: 'justify',
    });

    doc.line(20, 245, pageWidth - 20, 245);

    // 📌 Firma del Cliente y Empresa
    doc.setFontSize(12);
    doc.text('Firma del Cliente:', 20, 255);
    doc.line(20, 260, 100, 260);

    doc.text('Firma de la Empresa:', pageWidth - 80, 255);
    doc.line(pageWidth - 80, 260, pageWidth - 20, 260);

    // 📌 Descargar PDF
    const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `contrato_${car.plate}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log(`✅ Contrato generado y listo para descargar.`);
  }

  /**
   * Alterna la visibilidad de los filtros en el panel.
   */
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  /**
   * Captura los cambios del input de búsqueda y vuelve a aplicar los filtros.
   * @param event Evento de cambio del campo de búsqueda
   */
  onSearchChange(event: any): void {
    this.searchQuery = event.target.value;
    this.applyFilters();
  }
}
