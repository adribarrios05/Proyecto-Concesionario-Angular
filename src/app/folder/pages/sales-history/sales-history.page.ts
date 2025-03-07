import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/core/services/impl/car.service';
import { Car } from 'src/app/core/models/car.model';
import { FirebaseCar } from 'src/app/core/models/firebase/firebase-car.model';
import { BehaviorSubject, forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { DocumentReference, getDoc } from 'firebase/firestore';
import { Customer } from 'src/app/core/models/customer.model';
import { FirebaseCustomer } from 'src/app/core/models/firebase/firebase-customer.model';

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
    const filters: any = {}; // Quitamos el filtro para filtrar manualmente
  
    console.log("📌 Iniciando búsqueda de coches vendidos con filtros:", filters);
  
    this.carSvc.getAll(1, 100, filters).pipe(
      tap(response => {
        console.log("✅ Coches obtenidos antes del filtrado manual:", response.data);
      }),
      map(response => {
        // 🔥 Filtrar manualmente los coches que tienen un `customer` asignado
        const soldCars = response.data.filter(car => car.customer && car.customer !== null);
        console.log("✅ Coches filtrados con cliente asignado:", soldCars);
        return soldCars;
      }),
      switchMap((cars) => {
        if (cars.length === 0) {
          console.warn("⚠️ No se encontraron coches vendidos.");
          this._soldCars.next([]);
          return [];
        }
  
        // 🔥 Obtener los clientes de los coches vendidos
        const customerRequests = cars.map((car) => {
          console.log(`🔎 Procesando coche vendido: ${car.brand} ${car.model} (Placa: ${car.plate})`);
          console.log(`➡️ Cliente asociado (ID del documento): ${car.customer}`);
  
          if (typeof car.customer === 'string') {  // ⚠️ Verificamos si es un string (ID de Firestore)
            console.log(`✅ Buscando cliente en Firestore con ID: ${car.customer}`);
  
            return this.customerSvc.getById(car.customer).pipe(
              tap(customerData => {
                if (customerData) {
                  console.log(`🔍 Cliente encontrado en Firestore para coche ${car.plate}:`, customerData);
  
                  // Guardamos el cliente en un objeto con clave = ID del coche
                  this._customers.next({
                    ...this._customers.value,
                    [car.plate]: {
                      nombre: customerData.name || 'Desconocido',
                      apellidos: customerData.surname || 'Desconocido',
                      dni: customerData.dni || 'N/A'
                    }
                  });
  
                  console.log(`✅ Cliente asignado al coche ${car.plate}:`, this._customers.value[car.plate]);
                } else {
                  console.warn(`⚠️ Cliente no encontrado en Firestore para el coche ${car.plate}`);
                }
              })
            );
          } else {
            console.warn(`⚠️ Cliente no es un string ni un DocumentReference en el coche ${car.plate}:`, car.customer);
            return [];
          }
        });
  
        return forkJoin(customerRequests).pipe(
          tap(() => {
            console.log("🚀 Cargando coches filtrados en _soldCars");
            this._soldCars.next(cars);
          })
        );
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
