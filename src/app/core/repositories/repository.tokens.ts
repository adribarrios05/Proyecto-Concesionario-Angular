// src/app/repositories/repository.tokens.ts
import { InjectionToken } from '@angular/core';

export const RESOURCE_NAME_TOKEN = new InjectionToken<string>('ResourceName');
export const APPUSER_RESOURCE_NAME_TOKEN = new InjectionToken<string>('AppUserResourceName');
export const CAR_RESOURCE_NAME_TOKEN = new InjectionToken<string>('CarResourceName');
export const CUSTOMER_RESOURCE_NAME_TOKEN = new InjectionToken<string>('CustomerResourceName');


export const API_URL_TOKEN = new InjectionToken<string>('ApiUrl');
export const APPUSER_API_URL_TOKEN = new InjectionToken<string>('AppUserApiUrl');
export const CAR_API_URL_TOKEN = new InjectionToken<string>('CarApiUrl');
export const AUTH_SIGN_IN_API_URL_TOKEN = new InjectionToken<string>('AuthSignInApiUrl');
export const AUTH_SIGN_UP_API_URL_TOKEN = new InjectionToken<string>('AuthSignUpApiUrl');
export const AUTH_ME_API_URL_TOKEN = new InjectionToken<string>('AuthMeApiUrl');
export const UPLOAD_API_URL_TOKEN = new InjectionToken<string>('UploadApiUrl');


export const BACKEND_TOKEN = new InjectionToken<string>('Backend');