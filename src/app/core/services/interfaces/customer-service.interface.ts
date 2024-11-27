// src/app/services/interfaces/people.service.interface.ts

import { Customer } from '../../models/customer.model';
import { IBaseService } from './base-service.interface';

export interface ICustomerService extends IBaseService<Customer> {
  // Métodos específicos si los hay
}
