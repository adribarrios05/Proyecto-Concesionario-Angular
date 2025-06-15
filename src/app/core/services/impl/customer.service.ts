import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { Customer } from '../../models/customer.model';
import { ICustomerService } from '../interfaces/customer-service.interface';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { ICustomerRepository } from '../../repositories/intefaces/customer-repository.interface';
import { map, mergeMap, Observable } from 'rxjs';
import { Paginated } from '../../models/paginated.model';

/**
 * Servicio concreto para la entidad `Customer`, basado en el servicio genérico `BaseService`.
 *
 * @export
 * @class CustomerService
 * @extends {BaseService<Customer>}
 * @implements {ICustomerService}
 */
@Injectable({
  providedIn: 'root',
})
export class CustomerService
  extends BaseService<Customer>
  implements ICustomerService
{
  /**
   * Inyecta el repositorio de clientes y lo pasa al servicio base.
   *
   * @param repository Repositorio específico de cliente
   */
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN) override repository: ICustomerRepository
  ) {
    super(repository);
  }

  // Métodos adicionales específicos del cliente se pueden implementar aquí
}
