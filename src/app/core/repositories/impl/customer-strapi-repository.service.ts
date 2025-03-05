import { Inject, Injectable } from "@angular/core";
import { Data, StrapiRepositoryService } from "./strapi-repository.service";
import { HttpClient } from "@angular/common/http";
import { IStrapiAuthentication } from "../../services/interfaces/strapi-authentication.interface";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { STRAPI_AUTH_TOKEN, API_URL_TOKEN, RESOURCE_NAME_TOKEN, REPOSITORY_MAPPING_TOKEN, CAR_API_URL_TOKEN, CAR_REPOSITORY_MAPPING_TOKEN, CAR_RESOURCE_NAME_TOKEN, CUSTOMER_API_URL_TOKEN, CUSTOMER_REPOSITORY_MAPPING_TOKEN, CUSTOMER_RESOURCE_NAME_TOKEN } from "../repository.tokens";
import { Car } from "../../models/car.model";
import { ICarRepository } from "../intefaces/car-repository.interface";
import { map, Observable } from "rxjs";
import { Customer } from "../../models/customer.model";
import { ICustomerRepository } from "../intefaces/customer-repository.interface";
import { PaginatedRaw } from "./json-server-repository.service";
import { User } from "../../models/auth.model";
import { CustomerRaw } from "./customer-mapping-strapi.service";
import { Paginated } from "../../models/paginated.model";

@Injectable({
    providedIn: 'root'
})
export class CustomerStrapiRepositoryService extends StrapiRepositoryService<Customer> implements ICustomerRepository {
    
    constructor(
        http: HttpClient,
        @Inject(STRAPI_AUTH_TOKEN) override auth: IStrapiAuthentication,
        @Inject(CUSTOMER_API_URL_TOKEN) apiUrl: string, // URL base de la API para el modelo
        @Inject(CUSTOMER_RESOURCE_NAME_TOKEN) resource:string, //nombre del recurso del repositorio
        @Inject(CUSTOMER_REPOSITORY_MAPPING_TOKEN) mapping:IBaseMapping<Customer>
      ) {
        super(http, auth, apiUrl, resource, mapping);
      }

      protected override getHeaders() {
        const token = this.auth.getToken();
        return {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
        };
      }

      getCustomerWithUser(customerId: number): Observable<Customer> {
        const filters = { id: customerId.toString() }; 
        return this.getAll(1, 1, filters).pipe(
          map((customers: Customer[] | Paginated<Customer>) => {
            if (Array.isArray(customers)) {
              return customers[0]; 
            } else {
              return customers.data[0]; 
            }
          })
        );
      }

      getByUserId(userId: number): Observable<Customer | null> {
        return this.getAll(1, 1, { user_id: userId.toString() }).pipe(
          map(res => Array.isArray(res) ? res[0] || null : res.data[0] || null)
        );
      }

      override add(entity: any): Observable<any> {
        return this.http.post<any>(
          `${this.apiUrl}/${this.resource}?populate=user`, this.mapping.setAdd(entity), 
          this.getHeaders()).pipe(map(res=>{
            return this.mapping.getAdded(res);
          }));
      }
      
}