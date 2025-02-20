import { Inject, Injectable } from "@angular/core";
import { StrapiRepositoryService } from "./strapi-repository.service";
import { HttpClient } from "@angular/common/http";
import { IStrapiAuthentication } from "../../services/interfaces/strapi-authentication.interface";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { STRAPI_AUTH_TOKEN, API_URL_TOKEN, RESOURCE_NAME_TOKEN, REPOSITORY_MAPPING_TOKEN, CAR_API_URL_TOKEN, CAR_REPOSITORY_MAPPING_TOKEN, CAR_RESOURCE_NAME_TOKEN } from "../repository.tokens";
import { Car } from "../../models/car.model";
import { ICarRepository } from "../../../../../car-repository.interface";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CarStrapiRepositoryService extends StrapiRepositoryService<Car> implements ICarRepository {
    
    constructor(
        http: HttpClient,
        @Inject(STRAPI_AUTH_TOKEN) override auth: IStrapiAuthentication,
        @Inject(CAR_API_URL_TOKEN) apiUrl: string, 
        @Inject(CAR_RESOURCE_NAME_TOKEN) resource:string, 
        @Inject(CAR_REPOSITORY_MAPPING_TOKEN) mapping:IBaseMapping<Car>
      ) {
        super(http, auth, apiUrl, resource, mapping);
      }

      override getHeaders(isFormData: boolean = false) {
        const token = this.auth.getToken();
        const headers: any = {}

        return {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
        };
      }

      uploadImage(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('files', file); 
      
        return this.http.post<any>(
          `${this.apiUrl}/upload`,
          formData,
          this.getHeaders(true)
        );
      }

}