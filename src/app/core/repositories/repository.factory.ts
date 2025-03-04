// src/app/repositories/repository.factory.ts
import { FactoryProvider, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepositoryHttpService } from './impl/base-repository-http.service';
import { IBaseRepository } from './intefaces/base-repository.interface';
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, CAR_API_URL_TOKEN, CAR_COLLECTION_SUBSCRIPTION_TOKEN, CAR_REPOSITORY_MAPPING_TOKEN, CAR_REPOSITORY_TOKEN, CAR_RESOURCE_NAME_TOKEN, CUSTOMER_API_URL_TOKEN, CUSTOMER_COLLECTION_SUBSCRIPTION_TOKEN, CUSTOMER_REPOSITORY_MAPPING_TOKEN, CUSTOMER_REPOSITORY_TOKEN, CUSTOMER_RESOURCE_NAME_TOKEN, FIREBASE_CONFIG_TOKEN, UPLOAD_API_URL_TOKEN } from './repository.tokens';
import { BaseRespositoryLocalStorageService } from './impl/base-repository-local-storage.service';
import { Model } from '../models/base.model';
import { IBaseMapping } from './intefaces/base-mapping.interface';
import { JsonServerRepositoryService } from './impl/json-server-repository.service';
import { StrapiRepositoryService } from './impl/strapi-repository.service';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { IAuthMapping } from '../services/interfaces/auth-mapping.interface';
import { StrapiAuthenticationService } from '../services/impl/strapi-authentication.service';
import { StrapiAuthMappingService } from '../services/impl/strapi-auth-mapping.service';
import { IStrapiAuthentication } from '../services/interfaces/strapi-authentication.interface';
import { StrapiMediaService } from '../services/impl/strapi-media.service';
import { BaseMediaService } from '../services/impl/base-media.service';
import { Car } from '../models/car.model';
import { Customer } from '../models/customer.model';
import { CarMappingStrapi } from './impl/car-mapping-strapi.service';
import { CustomerMappingStrapi } from './impl/customer-mapping-strapi.service';
import { BaseRepositoryFirebaseService } from './impl/base-repository-firebase.service';
import { FirebaseAuthMappingService } from '../services/impl/firebase-auth-mapping.service';
import { FirebaseAuthenticationService } from '../services/impl/firebase-authentication.service';
import { CarMappingFirebaseService } from './impl/car-mapping-firebase.service';
import { CustomerMappingFirebaseService } from './impl/customer-mapping-firebase.service';
import { FirebaseMediaService } from '../services/impl/firebase-media.service';
import { FirebaseCollectionSubscriptionService } from '../services/impl/firebase-collection-subscription.service';
import { ICollectionSubscription } from '../services/interfaces/collection-subscription.interface';
import { IAuthentication } from '../services/interfaces/authentication.interface';

export function createBaseRepositoryFactory<T extends Model>(
  token: InjectionToken<IBaseRepository<T>>,
  dependencies:any[]): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string, http: HttpClient, auth:IStrapiAuthentication, apiURL: string, resource: string, mapping: IBaseMapping<T>, firebaseConfig?: any) => {
      switch (backend) {
        case 'http':
          return new BaseRepositoryHttpService<T>(http, auth, apiURL, resource, mapping);
        case 'local-storage':
          return new BaseRespositoryLocalStorageService<T>(resource, mapping);
        case 'json-server':
          return new JsonServerRepositoryService<T>(http, auth,apiURL, resource, mapping);
        case 'strapi':
          return new StrapiRepositoryService<T>(http, auth, apiURL, resource, mapping);
        case 'firebase':
          return new BaseRepositoryFirebaseService<T>(firebaseConfig, resource, mapping)
        default:
       
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};

export function createBaseMappingFactory<T extends Model>(
  token: InjectionToken<IBaseMapping<T>>,
  dependencies: any[],
  modelType: 'car' | 'customer',
): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string, firebaseConfig?: any) => {
      switch (backend) {
        case 'strapi':
          return modelType === 'car'
            ? new CarMappingStrapi()
            : new CustomerMappingStrapi();
        case 'firebase':
          return modelType === 'car'
            ? new CarMappingFirebaseService(firebaseConfig)
            : new CustomerMappingFirebaseService(firebaseConfig)
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};

export function createBaseAuthMappingFactory(token: InjectionToken<IAuthMapping>, dependencies:any[]): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string) => {
      switch (backend) {
        case 'http':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'local-storage':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'json-server':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'strapi':
          return new StrapiAuthMappingService();
        case 'firebase':
          return new FirebaseAuthMappingService();
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};


export const CarMappingFactory = createBaseMappingFactory<Car>(
  CAR_REPOSITORY_MAPPING_TOKEN, 
  [BACKEND_TOKEN],
  'car'
);

export const CustomerMappingFactory = createBaseMappingFactory<Customer>(
  CUSTOMER_REPOSITORY_MAPPING_TOKEN, 
  [BACKEND_TOKEN],
  'customer'
);

export const AuthMappingFactory: FactoryProvider = createBaseAuthMappingFactory(AUTH_MAPPING_TOKEN, [BACKEND_TOKEN]);

export const AuthenticationServiceFactory:FactoryProvider = {
  provide: BaseAuthenticationService,
  useFactory: (backend:string, firebaseConfig: any, signIn:string, signUp:string, meUrl:string, mapping:IAuthMapping, http:HttpClient) => {
    console.log("📌 Valor de BACKEND_TOKEN en AuthenticationServiceFactory:", backend);
    switch(backend){
      case 'http':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'local-storage':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'json-server':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'strapi':
        console.log("Esta usando el authService de Strapi")
        return new StrapiAuthenticationService(signIn, signUp, meUrl, mapping, http);
      case 'firebase':
        console.log("Esta usando el authServie de Firebase")
        return new FirebaseAuthenticationService(firebaseConfig, mapping)
      default:
        throw new Error("BACKEND NOT IMPLEMENTED");
    }
    
  },
  deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_MAPPING_TOKEN, HttpClient]
};

export const MediaServiceFactory:FactoryProvider = {
  provide: BaseMediaService,
  useFactory: (backend:string, firebaseConfig: any, upload:string, auth:IAuthentication, http:HttpClient) => {
    switch(backend){
      case 'http':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'local-storage':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'json-server':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'strapi':
        return new StrapiMediaService(upload, auth as IStrapiAuthentication, http);
      case 'firebase':
        return new FirebaseMediaService(firebaseConfig, auth)
      default:
        throw new Error("BACKEND NOT IMPLEMENTED");
    }
    
  },
  deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, UPLOAD_API_URL_TOKEN, BaseAuthenticationService, HttpClient]
};

export const CarRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Car>(CAR_REPOSITORY_TOKEN,
  [BACKEND_TOKEN, 
    HttpClient, 
    BaseAuthenticationService, 
    CAR_API_URL_TOKEN, 
    CAR_RESOURCE_NAME_TOKEN, 
    CAR_REPOSITORY_MAPPING_TOKEN,
    FIREBASE_CONFIG_TOKEN,
  ]
);
export const CustomerRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Customer>(CUSTOMER_REPOSITORY_TOKEN,
  [BACKEND_TOKEN, 
    HttpClient, 
    BaseAuthenticationService, 
    CUSTOMER_API_URL_TOKEN, 
    CUSTOMER_RESOURCE_NAME_TOKEN, 
    CUSTOMER_REPOSITORY_MAPPING_TOKEN,
    FIREBASE_CONFIG_TOKEN,
  ]
);

export function createCollectionSubscriptionFactory<T extends Model>(
  collectionName: string,
  mappingToken: InjectionToken<IBaseMapping<T>>,
  collectionSubscriptionToken: InjectionToken<ICollectionSubscription<T>>
): FactoryProvider {
  return {
    provide: collectionSubscriptionToken,
    useFactory: (backend: string, firebaseConfig: any, mapping: IBaseMapping<T>) => {
      switch (backend) {
        case 'firebase':
          return new FirebaseCollectionSubscriptionService<T>(firebaseConfig, mapping);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, mappingToken]
  };
}

// Factorías específicas para cada tipo
export const CarsCollectionSubscriptionFactory = createCollectionSubscriptionFactory<Car>(
  'cars',
  CAR_REPOSITORY_MAPPING_TOKEN,
  CAR_COLLECTION_SUBSCRIPTION_TOKEN
);

export const CustomersCollectionSubscriptionFactory = createCollectionSubscriptionFactory<Customer>(
  'customers',
  CUSTOMER_REPOSITORY_MAPPING_TOKEN,
  CUSTOMER_COLLECTION_SUBSCRIPTION_TOKEN
);

