import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController, Platform, RangeCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Car } from 'src/app/core/models/car.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { CarService } from 'src/app/core/services/impl/car.service';
import { InfiniteScrollCustomEvent, RangeValue } from '@ionic/core';
import { CarModalComponent } from 'src/app/components/car-modal/car-modal.component';
import { SearchParams } from 'src/app/core/repositories/intefaces/base-repository.interface';


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

  constructor(
    private modalCtrl: ModalController,
    private carSvc: CarService,
  ) { }

  ngOnInit() {
    this.loadCars()
  }

  page:number = 1;
  pageSize:number = 4;
  pages:number = 0;
  isLoading: boolean = true

  loadCars(filters: SearchParams = {}){
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

  applyFilters() {
    const filters: any = {};
  
    // Filtrar por rango de caballos
    if (this.caballos.lower !== 200 || this.caballos.upper !== 800) {
      filters.horsePower = {
        $gte: this.caballos.lower,
        $lte: this.caballos.upper,
      };
    }
  
    // Filtrar por rango de precio
    if (this.precio.lower !== 50000 || this.precio.upper !== 2000000) {
      filters.price = {
        $gte: this.precio.lower,
        $lte: this.precio.upper,
      };
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
  
        /*if (file) {
          // Subir la imagen primero
          this.carSvc.uploadImage(file).subscribe({
            next: (response) => {
              const imageUrl = response[0]?.url; 
  
              if (imageUrl) {
                carData.picture = { url: imageUrl }; 
  
                // Crea el coche con la imagen
                this.carSvc.addCar(carData).subscribe(() => {
                  this.cars$ = this.carSvc.getCars(); 
                });
              }
            },
            error: (err) => {
              console.error('Error al subir la imagen:', err);
            },
          });
        } else*/ {
          // Crea el coche sin imagen
          this.carSvc.add(carData).subscribe(() => {
            this.cars$ = this.carSvc.getAll(); 
          });
        }
      }
    });
  
    await modal.present();
  }

  onBuy(_t106: Car) {
    throw new Error('Method not implemented.');
    }

}
