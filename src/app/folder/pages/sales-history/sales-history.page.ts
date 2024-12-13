import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/core/services/impl/car.service';
import { Car } from 'src/app/core/models/car.model';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.page.html',
  styleUrls: ['./sales-history.page.scss'],
})
export class SalesHistoryPage implements OnInit {
  cars: Car[] = [];

  constructor(private carService: CarService) {}

  ngOnInit() {
    //this.loadSoldCars();
  }

  /*loadSoldCars() {
    this.carService.getAll(-1, -1, { customerId: 'defined' }).subscribe({
      next: (response) => {
        this.cars = response.map((car: Car) => ({
          ...car,
          customer: car.customer || {
            name: 'Unknown',
            dni: 'N/A',
          },
        }));
      },
      error: (err) => {
        console.error('Error loading sold cars:', err);
      },
    });
  }*/
  
}
