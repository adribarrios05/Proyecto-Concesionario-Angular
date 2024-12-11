import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController, Platform, RangeCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Car } from 'src/app/core/models/car.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { CarService } from 'src/app/core/services/impl/car.service';
import { InfiniteScrollCustomEvent, RangeValue } from '@ionic/core';
import { CarModalComponent } from 'src/app/components/car-modal/car-modal.component';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: false
})
export class InventoryPage implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  caballos: RangeValue = { lower: 200, upper: 800 };
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

  loadCars(){
    this.page=1;
    this.carSvc.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Car>)=>{
        this._cars.next([...response.data]);
        this.page++;
        this.pages = response.pages;
      }
    });
  }

  loadMoreCars(notify: HTMLIonInfiniteScrollElement | null = null){
    if(this.page<=this.pages){
      this.carSvc.getAll(this.page, this.pageSize).subscribe({
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

  onCaballosChange(ev: Event) {
    const rangeEvent = ev as RangeCustomEvent;
    this.caballos = rangeEvent.detail.value;
    console.log('Nuevo rango de caballos:', this.caballos);
  }

  onPrecioChange(ev: Event) {
    const rangeEvent = ev as RangeCustomEvent; 
    this.precio = rangeEvent.detail.value;
    console.log('Nuevo rango de precios:', this.precio);
  }

  onMarcaChange() {
    this.filterChange.emit({
      caballos: this.caballos,
      precio: this.precio,
      marcas: this.marcasSeleccionadas
    });
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

}
