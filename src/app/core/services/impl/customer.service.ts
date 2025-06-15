import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { Customer } from '../../models/customer.model';
import { ICustomerService } from '../interfaces/customer-service.interface';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { ICustomerRepository } from '../../repositories/intefaces/customer-repository.interface';
import { map, mergeMap, Observable } from 'rxjs';
import { Paginated } from '../../models/paginated.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService
  extends BaseService<Customer>
  implements ICustomerService
{
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN) override repository: ICustomerRepository
  ) {
    super(repository);
  }

}
