// src/app/repositories/repository.tokens.ts
import { InjectionToken } from '@angular/core';
import { IBaseRepository } from './intefaces/base-repository.interface';
import { IBaseMapping } from './intefaces/base-mapping.interface';
import { IStrapiAuthentication } from '../services/interfaces/strapi-authentication.interface';
import { IAuthentication } from '../services/interfaces/authentication.interface';
import { ICarRepository } from './intefaces/car-repository.interface';
import { ICustomerRepository } from './intefaces/customer-repository.interface';
import { Car } from '../models/car.model';
import { Customer } from '../models/customer.model';
import { User } from '../models/auth.model';
import { ICollectionSubscription } from '../services/interfaces/collection-subscription.interface';

export const RESOURCE_NAME_TOKEN = new InjectionToken<string>('ResourceName');
export const CAR_RESOURCE_NAME_TOKEN = new InjectionToken<string>('CarResourceName');
export const CUSTOMER_RESOURCE_NAME_TOKEN = new InjectionToken<string>('CustomerResourceName');
export const REPOSITORY_TOKEN = new InjectionToken<IBaseRepository<any>>('REPOSITORY_TOKEN');
export const CAR_REPOSITORY_TOKEN = new InjectionToken<ICarRepository>('ICarRepository');
export const CUSTOMER_REPOSITORY_TOKEN = new InjectionToken<ICustomerRepository>('ICustomerRepository');


export const API_URL_TOKEN = new InjectionToken<string>('ApiUrl');
export const CAR_API_URL_TOKEN = new InjectionToken<string>('CarApiUrl');
export const CUSTOMER_API_URL_TOKEN = new InjectionToken<string>('CustomerApiUrl');

export const AUTH_SIGN_IN_API_URL_TOKEN = new InjectionToken<string>('AuthSignInApiUrl');
export const AUTH_SIGN_UP_API_URL_TOKEN = new InjectionToken<string>('AuthSignUpApiUrl');
export const AUTH_ME_API_URL_TOKEN = new InjectionToken<string>('AuthMeApiUrl');
export const UPLOAD_API_URL_TOKEN = new InjectionToken<string>('UploadApiUrl');

export const REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<any>>('IBaseRepositoryMapping');
export const CAR_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Car>>('ICarRepositoryMapping');
export const CUSTOMER_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Customer>>('ICustomerRepositoryMapping');
export const AUTH_TOKEN = new InjectionToken<IAuthentication>('IAuthentication');
export const STRAPI_AUTH_TOKEN = new InjectionToken<IStrapiAuthentication>('IStrapiAuthentication');
export const AUTH_MAPPING_TOKEN = new InjectionToken<IBaseMapping<User>>('IAuthMapping');
export const BACKEND_TOKEN = new InjectionToken<string>('Backend');
export const FIREBASE_CONFIG_TOKEN = new InjectionToken<any>('FIREBASE_CONFIG_TOKEN');
export const FIREBASE_COLLECTION_TOKEN = new InjectionToken<string>('FIREBASE_COLLECTION_TOKEN');
export const CAR_COLLECTION_SUBSCRIPTION_TOKEN = new InjectionToken<ICollectionSubscription<Car>>('CarCollectionSubscriptionToken');
export const CUSTOMER_COLLECTION_SUBSCRIPTION_TOKEN = new InjectionToken<ICollectionSubscription<Customer>>('CustomerCollectionSubscriptionToken');