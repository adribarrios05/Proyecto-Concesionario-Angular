// src/app/services/interfaces/people.service.interface.ts

import { Observable } from 'rxjs';
import { Customer } from '../../models/customer.model';
import { IBaseService } from './base-service.interface';

export interface ICustomerService extends IBaseService<Customer> {
  getByUserId(userId: string): Observable<Customer | null>;
}
