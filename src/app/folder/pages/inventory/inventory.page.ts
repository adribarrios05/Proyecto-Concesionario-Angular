import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertController, ModalController, Platform, RangeCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Car } from 'src/app/core/models/car.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { CarService } from 'src/app/core/services/impl/car.service';
import { InfiniteScrollCustomEvent, RangeValue } from '@ionic/core';
import { CarModalComponent } from 'src/app/components/car-modal/car-modal.component';
import { SearchParams } from 'src/app/core/repositories/intefaces/base-repository.interface';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CustomerService } from 'src/app/core/services/impl/customer.service';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: false
})
export class InventoryPage implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  caballos: RangeValue = { lower: 200, upper: 1200 };
  precio: RangeValue = { lower: 50000, upper: 2000000 }
  marcasSeleccionadas: string[] = [];
  _cars: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>([]);
  cars$: Observable<Car[]> = this._cars.asObservable();
  isLoggedIn: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private carSvc: CarService,
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.authSvc.me().subscribe({
      next: (user) => {
        this.isLoggedIn = true; 
      },
      error: () => {
        this.isLoggedIn = false; 
      },
    });
    this.loadCars()
  }

  page:number = 1;
  pageSize:number = 4;
  pages:number = 0;
  isLoading: boolean = true

  loadCars(filters: SearchParams = {}){
    this._cars.subscribe(data => {
      console.log("Datos de los coches:", data); // Verifica los datos que devuelve el servicio
    });
    this.page=1;
    this.carSvc.getAll(this.page, this.pageSize, filters).subscribe({
      next:(response:Paginated<Car>)=>{
        this._cars.next([...response.data]);
        this.page++;
        this.pages = response.pages;
      },
      error: (err) => console.error("Error al cargar los datos del coche", err),
    });
  }

  loadMoreCars(notify: HTMLIonInfiniteScrollElement | null = null, filters: SearchParams = {}){
    if(this.page<=this.pages){
      this.carSvc.getAll(this.page, this.pageSize, filters).subscribe({
        next:(response:Paginated<Car>)=>{
          this._cars.next([...this._cars.value, ...response.data])
          this.page++
          notify?.complete()
        }
      })
    } else {
      notify?.complete()
    }
  }

  isRangeValue(value: RangeValue): value is { lower: number; upper: number } {
    return typeof value === 'object' && 'lower' in value && 'upper' in value;
  }
  

  applyFilters() {
    const filters: any = {};
  
    // Filtrar por rango de caballos
    if (
      typeof this.caballos === 'object' && 
      'lower' in this.caballos && 
      'upper' in this.caballos
    ) {
      if (this.caballos.lower !== 200 || this.caballos.upper !== 800) {
        filters.horsePower = {
          $gte: this.caballos.lower,
          $lte: this.caballos.upper,
        };
      }
    } else {
      // Maneja el caso en el que `caballos` es un número o no tiene las propiedades necesarias
      console.error("La variable 'caballos' no tiene el formato esperado.");
    }
  
    // Filtrar por rango de precio
    if (
      typeof this.precio === 'object' && 
      'lower' in this.precio && 
      'upper' in this.precio
    ) {
      if (this.precio.lower !== 200 || this.precio.upper !== 800) {
        filters.horsePower = {
          $gte: this.precio.lower,
          $lte: this.precio.upper,
        };
      }
    } else {
      // Maneja el caso en el que `precio` es un número o no tiene las propiedades necesarias
      console.error("La variable 'precio' no tiene el formato esperado.");
    }
  
    // Filtrar por marcas seleccionadas
    if (this.marcasSeleccionadas.length > 0) {
      filters.brand = {
        $in: this.marcasSeleccionadas,
      };
    }
    this.loadCars(filters);
  }

  resetFilters() {
    this.caballos = { lower: 200, upper: 800 };
    this.precio = { lower: 50000, upper: 2000000 };
    this.marcasSeleccionadas = [];
    this.applyFilters();
  }

  onCaballosChange(ev: Event) {
    const rangeEvent = ev as RangeCustomEvent;
    this.caballos = rangeEvent.detail.value;
    console.log('Nuevo rango de caballos:', this.caballos);
    this.applyFilters()
  }

  onPrecioChange(ev: Event) {
    const rangeEvent = ev as RangeCustomEvent; 
    this.precio = rangeEvent.detail.value;
    console.log('Nuevo rango de precios:', this.precio);
    this.applyFilters()
  }

  onMarcaChange(ev: any, marca: string) {
    if (ev.detail.checked) {
      this.marcasSeleccionadas.push(marca);
    } else {
      this.marcasSeleccionadas = this.marcasSeleccionadas.filter(m => m !== marca);
    }
    this.applyFilters();
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    if(this.page<=this.pages){}
      timer(1000).subscribe({
        next:(value)=>{
          this.loadMoreCars(ev.target)
        }
      })
  }

  async openCarModal() {
    const modal = await this.modalCtrl.create({
      component: CarModalComponent,
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const { carData, file } = result.data; 

          this.carSvc.add(carData).subscribe(() => {
            this.cars$ = this.carSvc.getAll(); 
          });
      }
    });
  
    await modal.present();
  }

  onBuy(car: Car) {
    if (this.isLoggedIn) {
      this.presentConfirmAlert(car);
    } else {
      console.error('El usuario no está autenticado');
    }
  }
  
  async presentConfirmAlert(car: Car) {
    const alert = await this.alertController.create({
      header: 'Confirmar Compra',
      message: `¿Está seguro de que desea comprar el ${car.brand} ${car.model}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Compra cancelada');
          },
        },
        {
          text: 'Sí',
          handler: () => {
            this.processPurchase(car);
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  processPurchase(car: Car) {
    this.authSvc.me().subscribe({
      next: (user) => {
        if (user) {
          this.customerSvc.getByUserId(user.id).subscribe({
            next: (customer) => {
              if (customer) {
                const updatedCar = { ...car, customerId: customer.id };
                this.carSvc.update(updatedCar.id, updatedCar).subscribe({
                  next: () => {
                    console.log(`Coche ${car.brand} ${car.model} comprado con éxito por el cliente ${customer.name}. Id: ${car.customer}`);
                  },
                  error: (err) => {
                    console.error('Error al comprar el coche:', err);
                  },
                });
              } else {
                console.error('No se encontró un cliente asociado al usuario');
              }
            },
            error: (err) => {
              console.error('Error al obtener el cliente:', err);
            },
          });
        } else {
          console.error('Usuario no encontrado en la sesión activa');
        }
      },
      error: (err) => {
        console.error('Error al verificar la sesión:', err);
      },
    });
  }

  onDelete(car: Car) {
    this.presentDeleteConfirmAlert(car);
  }
  
  async presentDeleteConfirmAlert(car: Car) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro de que desea eliminar el coche ${car.brand} ${car.model}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteCar(car);
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  deleteCar(car: Car) {
    this.carSvc.delete(car.id).subscribe({
      next: () => {
        console.log(`Coche ${car.brand} ${car.model} eliminado con éxito.`);
        this.loadCars(); 
      },
      error: (err) => {
        console.error('Error al eliminar el coche:', err);
      },
    });
  }

}
