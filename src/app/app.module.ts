import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPageModule } from './folder/pages/login/login.module';
import { InventoryPageModule } from './folder/pages/inventory/inventory.module';
import { SharedModule } from './shared/shared.module';
import { provideHttpClient } from '@angular/common/http';
import { BACKEND_TOKEN, CAR_RESOURCE_NAME_TOKEN, CUSTOMER_RESOURCE_NAME_TOKEN, CAR_API_URL_TOKEN, CUSTOMER_API_URL_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, UPLOAD_API_URL_TOKEN } from './core/repositories/repository.tokens';
import { CarService } from './core/services/impl/car.service';
import { AuthMappingFactory, AuthenticationServiceFactory, CarMappingFactory, CarRepositoryFactory, CustomerMappingFactory, CustomerRepositoryFactory, MediaServiceFactory } from './core/repositories/repository.factory';
import { RegisterPageModule } from './folder/pages/register/register.module';
import { environment } from 'src/environments/environment.prod';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    LoginPageModule,
    RegisterPageModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy },
  provideHttpClient(),
  { provide: BACKEND_TOKEN, useValue: 'strapi' },
  { provide: CAR_RESOURCE_NAME_TOKEN, useValue: 'cars' },
  { provide: CUSTOMER_RESOURCE_NAME_TOKEN, useValue: 'customers' },
  { provide: CAR_API_URL_TOKEN, useValue: `${environment.apiUrl}/api` },
  { provide: CUSTOMER_API_URL_TOKEN, useValue: `${environment.apiUrl}/api` },
  { provide: AUTH_SIGN_IN_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/auth/local` },
  { provide: AUTH_SIGN_UP_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/auth/local/register` },
  { provide: AUTH_ME_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/users/me` },
  { provide: UPLOAD_API_URL_TOKEN, useValue: `${environment.apiUrl}/api/upload` },

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
  }

  ],
    
  bootstrap: [AppComponent],
})
export class AppModule {}
