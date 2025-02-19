import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { Customer } from '../../models/customer.model';
import { ICustomerService } from '../interfaces/customer-service.interface';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { ICustomerRepository } from '../../repositories/intefaces/customer-repository.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService<Customer> implements ICustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN) protected override repository: ICustomerRepository // 🔹 Se asegura de que usa ICustomerRepository
  ) {
    super(repository);
  }

  getByUserId(userId: string): Observable<Customer | null> {
    return this.repository.getAll(1, 1, { user: userId }).pipe(
      map(res => Array.isArray(res) ? res[0] || null : res.data[0] || null)
    );
  }

  getCustomerWithUser(customerId: number): Observable<Customer> {
    return this.repository.getCustomerWithUser(customerId);
  }
}
