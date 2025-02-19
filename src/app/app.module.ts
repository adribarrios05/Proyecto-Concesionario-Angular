import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPageModule } from './folder/pages/login/login.module';
import { InventoryPageModule } from './folder/pages/inventory/inventory.module';
import { SharedModule } from './shared/shared.module';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BACKEND_TOKEN, CAR_RESOURCE_NAME_TOKEN, CUSTOMER_RESOURCE_NAME_TOKEN, CAR_API_URL_TOKEN, CUSTOMER_API_URL_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, UPLOAD_API_URL_TOKEN, STRAPI_AUTH_TOKEN, FIREBASE_CONFIG_TOKEN } from './core/repositories/repository.tokens';
import { CarService } from './core/services/impl/car.service';
import { CustomerService } from './core/services/impl/customer.service';
import { AuthMappingFactory, AuthenticationServiceFactory, CarMappingFactory, CarRepositoryFactory, CustomerMappingFactory, CustomerRepositoryFactory, MediaServiceFactory } from './core/repositories/repository.factory';
import { RegisterPageModule } from './folder/pages/register/register.module';
import { environment } from 'src/environments/environment';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { StrapiAuthenticationService } from './core/services/impl/strapi-authentication.service';
import { IStrapiAuthentication } from './core/services/interfaces/strapi-authentication.interface';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FirebaseAuthenticationService } from './core/services/impl/firebase-authentication.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    LoginPageModule,
    RegisterPageModule,
    SharedModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy },
  provideHttpClient(),
  { provide: BACKEND_TOKEN, useValue: 'firebase' },
  { provide: CAR_RESOURCE_NAME_TOKEN, useValue: 'cars' },
  { provide: CUSTOMER_RESOURCE_NAME_TOKEN, useValue: 'customers' },
  { provide: CAR_API_URL_TOKEN, useValue: `${environment.apiUrl}/api` },
  { provide: CUSTOMER_API_URL_TOKEN, useValue: `${environment.apiUrl}/api` },
  { provide: AUTH_SIGN_IN_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/auth/local` },
  { provide: AUTH_SIGN_UP_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/auth/local/register` },
  { provide: AUTH_ME_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/users/me` },
  { provide: UPLOAD_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/upload` },
  { provide: FIREBASE_CONFIG_TOKEN, useValue: 
    {
      apiKey: "AIzaSyDXjHUKnlhNBpIpfdxOZlAKb1vykp8ElPo",
      authDomain: "concesionarios-baca.firebaseapp.com",
      projectId: "concesionarios-baca",
      storageBucket: "concesionarios-baca.firebasestorage.app",
      messagingSenderId: "1098140390614",
      appId: "1:1098140390614:web:f468fba37feeba8ddea577",
      measurementId: "G-FWC8EPFFQG"
    }
  },
  CarMappingFactory,
  CustomerMappingFactory,
  AuthMappingFactory,
  AuthenticationServiceFactory,
  MediaServiceFactory,
  CarRepositoryFactory,
  CustomerRepositoryFactory,
  {
    provide: 'CarService',
    useClass: CarService
  },
  {
    provide: 'CustomerService',
    useClass: CustomerService
  },
  {
    provide: STRAPI_AUTH_TOKEN,
    useClass: StrapiAuthenticationService,
  }

  ],
    
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    console.log("📌 BACKEND_TOKEN cargado:", 'firebase'); // Debug
  }
}
