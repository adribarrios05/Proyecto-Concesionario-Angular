import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Platform, RangeCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Car } from 'src/app/core/models/car.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { CarService } from 'src/app/core/services/impl/car.service';
import { RangeValue } from '@ionic/core';


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
    private carSvc: CarService,
  ) { }

  ngOnInit() {
    this.loadCars()
  }

  page:number = 1;
  pageSize:number = 25;
  pages:number = 0;

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
    /*this.filterChange.emit({
      caballos: this.caballos,
      precio: this.precio,
      marcas: this.marcasSeleccionadas
    });*/
  }

  
}
