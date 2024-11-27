import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Car } from 'src/app/core/models/car.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { CarService } from 'src/app/core/services/impl/car.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: false
})
export class InventoryPage implements OnInit {

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
}
