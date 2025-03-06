import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { Customer } from '../../models/customer.model';
import { ICustomerService } from '../interfaces/customer-service.interface';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { ICustomerRepository } from '../../repositories/intefaces/customer-repository.interface';
import { map, mergeMap, Observable } from 'rxjs';
import { Paginated } from '../../models/paginated.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService<Customer> implements ICustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY_TOKEN) override repository: ICustomerRepository 
  ) {
    super(repository);
  }

  getByUserId(userId: string): Observable<Customer | null> {
    console.log("🔎 Buscando cliente en Firebase con userId:", userId);
  
    return this.repository.getAll(1, 1, { user: userId }).pipe( // 🔹 Cambiado de "userId" a "user"
      map(res => {
        console.log("📌 Resultado del getByUserId:", res);
  
        if (!res || (Array.isArray(res) && res.length === 0) || (!Array.isArray(res) && res.data.length === 0)) {
          console.warn("⚠️ No se encontró cliente con este userId:", userId);
          return null;
        }
  
        const customer = Array.isArray(res) ? res[0] : res.data[0];
        console.log("✅ Cliente encontrado en Firebase:", customer);
        return customer as Customer;
      })
    );
  }
  
  
  }
