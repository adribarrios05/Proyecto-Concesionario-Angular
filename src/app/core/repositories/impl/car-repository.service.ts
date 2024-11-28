import { Injectable } from '@angular/core';
import { ICarRepository } from '../../repositories/intefaces/car-repository.interface';
import { Car } from '../../models/car.model';
import { Observable } from 'rxjs';
import { StrapiRepositoryService } from './strapi-repository.service';

@Injectable({
  providedIn: 'root',
})
export class CarRepository implements ICarRepository {
  constructor(private strapiRepository: StrapiRepositoryService<Car>) {}
    getById(id: string): Observable<Car | null> {
        throw new Error('Method not implemented.');
    }
    add(entity: Car): Observable<Car> {
        throw new Error('Method not implemented.');
    }
    update(id: string, entity: Car): Observable<Car> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Observable<Car> {
        throw new Error('Method not implemented.');
    }

  getAll(page: number, pageSize: number, filters: any = {}) {
    return this.strapiRepository.getAll(page, pageSize, filters);
  }

  // Puedes implementar otros métodos como add(), update(), delete(), etc.
}
