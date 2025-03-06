import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/core/services/impl/car.service';
import { Car } from 'src/app/core/models/car.model';
import { FirebaseCar } from 'src/app/core/models/firebase/firebase-car.model';
import { BehaviorSubject, forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { DocumentReference, getDoc } from 'firebase/firestore';
import { Customer } from 'src/app/core/models/customer.model';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.page.html',
  styleUrls: ['./sales-history.page.scss'],
})
export class SalesHistoryPage implements OnInit {
  _soldCars: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>([]);
  soldCars$: Observable<Car[]> = this._soldCars.asObservable();

  _customers: BehaviorSubject<{ [carId: string]: any }> = new BehaviorSubject<{ [carId: string]: any }>({});
  customers$: Observable<{ [carId: string]: any }> = this._customers.asObservable();

  constructor(
    private carSvc: CarService,
    private customerSvc: CustomerService
  ) {}

  ngOnInit() {
    this.loadSoldCars();
  }

  loadSoldCars() {
    const filters: any = { customer: { $ne: null } }; // Solo coches vendidos

    this.carSvc.getAll(1, 100, filters).pipe(
      switchMap((response) => {
        const cars = response.data;

        // Obtener los clientes de los coches vendidos
        const customerRequests = cars.map(car => {
          if (typeof car.customer === 'string') {
            return this.customerSvc.getByUserId(car.customer).pipe(
              tap(customer => {
                // Guardamos el cliente en un objeto con clave = ID del coche
                const currentCustomers = this._customers.value;
                this._customers.next({ ...currentCustomers, [car.id]: customer });
              })
            );
          }
          return [];
        });

        return forkJoin(customerRequests).pipe(tap(() => this._soldCars.next(cars)));
      })
    ).subscribe();
  } 

  // 🔹 Verifica si `customer` es un DocumentReference de Firebase
  isDocumentReference(value: any): value is DocumentReference {
    return value && typeof value === 'object' && 'id' in value && 'path' in value;
  }

  getContractDownloadLink(car: Car): string {
    return `contratos/contrato_${car.plate}.pdf`; // Ruta de contratos
  }

  onIonInfinite(event: any) {
    event.target.complete();
  }
  
}
