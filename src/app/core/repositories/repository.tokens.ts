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

/**
 * Token genérico para el nombre del recurso
 */
export const RESOURCE_NAME_TOKEN = new InjectionToken<string>('ResourceName');

/**
 * Token para el nombre del recurso Car
 */
export const CAR_RESOURCE_NAME_TOKEN = new InjectionToken<string>('CarResourceName');

/**
 * Token para el nombre del recurso Customer
 */
export const CUSTOMER_RESOURCE_NAME_TOKEN = new InjectionToken<string>('CustomerResourceName');

/**
 * Token para inyectar el repositorio base
 */
export const REPOSITORY_TOKEN = new InjectionToken<IBaseRepository<any>>('REPOSITORY_TOKEN');

/**
 * Token para inyectar el repositorio de coches
 */
export const CAR_REPOSITORY_TOKEN = new InjectionToken<ICarRepository>('ICarRepository');

/**
 * Token para inyectar el repositorio de clientes
 */
export const CUSTOMER_REPOSITORY_TOKEN = new InjectionToken<ICustomerRepository>('ICustomerRepository');

/**
 * Token para la URL base de la API
 */
export const API_URL_TOKEN = new InjectionToken<string>('ApiUrl');

/**
 * Token para la URL de la API de coches
 */
export const CAR_API_URL_TOKEN = new InjectionToken<string>('CarApiUrl');

/**
 * Token para la URL de la API de clientes
 */
export const CUSTOMER_API_URL_TOKEN = new InjectionToken<string>('CustomerApiUrl');

/**
 * Token para la URL de inicio de sesión (sign in)
 */
export const AUTH_SIGN_IN_API_URL_TOKEN = new InjectionToken<string>('AuthSignInApiUrl');

/**
 * Token para la URL de registro (sign up)
 */
export const AUTH_SIGN_UP_API_URL_TOKEN = new InjectionToken<string>('AuthSignUpApiUrl');

/**
 * Token para la URL de obtención del usuario actual (me)
 */
export const AUTH_ME_API_URL_TOKEN = new InjectionToken<string>('AuthMeApiUrl');

/**
 * Token para la URL de subida de archivos
 */
export const UPLOAD_API_URL_TOKEN = new InjectionToken<string>('UploadApiUrl');

/**
 * Token para el mapping genérico del repositorio base
 */
export const REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<any>>('IBaseRepositoryMapping');

/**
 * Token para el mapping del repositorio de coches
 */
export const CAR_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Car>>('ICarRepositoryMapping');

/**
 * Token para el mapping del repositorio de clientes
 */
export const CUSTOMER_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Customer>>('ICustomerRepositoryMapping');

/**
 * Token para la autenticación genérica
 */
export const AUTH_TOKEN = new InjectionToken<IAuthentication>('IAuthentication');

/**
 * Token para la autenticación en Strapi
 */
export const STRAPI_AUTH_TOKEN = new InjectionToken<IStrapiAuthentication>('IStrapiAuthentication');

/**
 * Token para el mapping de usuario
 */
export const AUTH_MAPPING_TOKEN = new InjectionToken<IBaseMapping<User>>('IAuthMapping');

/**
 * Token para identificar el backend actual (por ejemplo, Firebase o Strapi)
 */
export const BACKEND_TOKEN = new InjectionToken<string>('Backend');

/**
 * Token con la configuración de Firebase
 */
export const FIREBASE_CONFIG_TOKEN = new InjectionToken<any>('FIREBASE_CONFIG_TOKEN');

/**
 * Token para el nombre de la colección en Firebase
 */
export const FIREBASE_COLLECTION_TOKEN = new InjectionToken<string>('FIREBASE_COLLECTION_TOKEN');

/**
 * Token para suscripción en tiempo real a la colección de coches
 */
export const CAR_COLLECTION_SUBSCRIPTION_TOKEN = new InjectionToken<ICollectionSubscription<Car>>('CarCollectionSubscriptionToken');

/**
 * Token para suscripción en tiempo real a la colección de clientes
 */
export const CUSTOMER_COLLECTION_SUBSCRIPTION_TOKEN = new InjectionToken<ICollectionSubscription<Customer>>('CustomerCollectionSubscriptionToken');
