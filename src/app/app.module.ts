import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPageModule } from './folder/pages/login/login.module';
import { NavBarComponent } from './components/navbar/navbar.component';
import { InventoryPageModule } from './folder/pages/inventory/inventory.module';
import { SharedModule } from './shared/shared.module';
import { provideHttpClient } from '@angular/common/http';
import { APPUSERS_API_URL_TOKEN, APPUSERS_RESOURCE_NAME_TOKEN, BACKEND_TOKEN, CAR_RESOURCE_NAME_TOKEN, CUSTOMER_RESOURCE_NAME_TOKEN } from './core/repositories/repository.tokens';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    LoginPageModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: RouteReuseStrategy, 
    useClass: IonicRouteStrategy },
  provideHttpClient(),
  { provide: BACKEND_TOKEN, useValue: 'strapi' },
  { provide: APPUSERS_RESOURCE_NAME_TOKEN, useValue: 'app-users' },
  { provide: CAR_RESOURCE_NAME_TOKEN, useValue: 'cars' },
  { provide: CUSTOMER_RESOURCE_NAME_TOKEN, useValue: 'customers' },
  { provide: APPUSERS_API_URL_TOKEN, useValue: 'http://localhost:1337/api' },
  ],
    
  bootstrap: [AppComponent],
})
export class AppModule {}
