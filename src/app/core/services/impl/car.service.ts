// src/app/services/impl/people.service.ts
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { map, Observable } from 'rxjs';
import { Car } from '../../models/car.model';
import { ICarService } from '../interfaces/car-service.interface';
import { ICarRepository } from '../../repositories/intefaces/car-repository.interface';
import { CAR_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';

@Injectable({
  providedIn: 'root'
})
export class CarService extends BaseService<Car> implements ICarService {
  constructor(
    @Inject(CAR_REPOSITORY_TOKEN) repository: ICarRepository
  ) {
    super(repository);

  }


    /*uploadImage(file: File): Observable<any>{
        return this.repository.uploadImage(file);
    }*/
        override update(id: string, car: Car): Observable<Car> {
          console.log("🔄 Actualizando coche en Firebase con customerId:", car.customer);
          return this.repository.update(id, car);
        }
  
}
