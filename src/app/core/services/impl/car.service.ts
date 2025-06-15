// src/app/services/impl/people.service.ts
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { map, Observable } from 'rxjs';
import { Car } from '../../models/car.model';
import { ICarService } from '../interfaces/car-service.interface';
import { ICarRepository } from '../../repositories/intefaces/car-repository.interface';
import { CAR_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';

/**
 * Servicio concreto para la entidad `Car`, extendiendo el servicio base.
 * Encapsula lógica específica para actualizar coches y conecta con su repositorio.
 *
 * @export
 * @class CarService
 * @extends {BaseService<Car>}
 * @implements {ICarService}
 */
@Injectable({
  providedIn: 'root'
})
export class CarService extends BaseService<Car> implements ICarService {

  /**
   * Inyecta el repositorio de coches y lo pasa al servicio base.
   *
   * @param repository Repositorio de tipo `ICarRepository`
   */
  constructor(
    @Inject(CAR_REPOSITORY_TOKEN) repository: ICarRepository
  ) {
    super(repository);
  }

  /**
   * Actualiza un coche e imprime por consola su customerId antes de enviar al repositorio.
   *
   * @param id ID del coche
   * @param car Objeto `Car` actualizado
   * @returns Observable con el coche actualizado
   */
  override update(id: string, car: Car): Observable<Car> {
    console.log("🔄 Actualizando coche en Firebase con customerId:", car.customer);
    return this.repository.update(id, car);
  }
}
