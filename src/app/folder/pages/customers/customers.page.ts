import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfiniteScrollCustomEvent, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { CustomerModalComponent } from 'src/app/components/customer-modal/customer-modal.component';
import { User } from 'src/app/core/models/auth.model';
import { Car } from 'src/app/core/models/car.model';
import { Customer } from 'src/app/core/models/customer.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { CUSTOMER_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.tokens';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { ICollectionSubscription, CollectionChange } from 'src/app/core/services/interfaces/collection-subscription.interface';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  _customers:BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);
  customers$:Observable<Customer[]> = this._customers.asObservable();
  _users:BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  users$:Observable<User[]> = this._users.asObservable();
  isWeb: boolean = false
  private loadedIds: Set<string> = new Set(); 

  constructor(
    private customerService: CustomerService,
    private modalCtrl: ModalController,
    private platform: Platform,
    @Inject(CUSTOMER_COLLECTION_SUBSCRIPTION_TOKEN) private customerSubscription: ICollectionSubscription<Customer>
    
  ) {
    this.isWeb = this.platform.is('desktop')
  }

  ngOnInit() {
    this.loadCustomers()
    this.customerSubscription.subscribe('customers').subscribe((change: CollectionChange<Customer>) => {
          const currentCustomers = [...this._customers.value]
    
          // Solo procesar cambios de documentos que ya tenemos cargados
          if (!this.loadedIds.has(change.id) && change.type !== 'added') {
            return;
          }
    
          switch(change.type) {
            case 'added':
            case 'modified':
              const index = currentCustomers.findIndex(p => p.id === change.id);
              if (index >= 0) {
                currentCustomers[index] = change.data!;
              }
              break;
            case 'removed':
              const removeIndex = currentCustomers.findIndex(p => p.id === change.id);
              if (removeIndex >= 0) {
                currentCustomers.splice(removeIndex, 1);
                this.loadedIds.delete(change.id);
              }
              break;
          }
          this._customers.next(currentCustomers);
    
        })
  }

  page: number = 1
  pageSize: number = 20
  pages: number = 0

  loadCustomers(){
    this.page = 1
    this.customerService.getAll(this.page, this.pageSize, {}).subscribe({
      next: (response: Paginated<Customer>) => {
        console.log("Datos obtenidos de la API:", response.data);

        const userData = response.data.map((customer) => {
          const userId = customer.userId
        })

        response.data.forEach(customer => this.loadedIds.add(customer.id));

        this._customers.next(response.data)
        this.page++
        this.pages = response.pages

        this._customers.subscribe(data =>{
          console.log("Datos actualizados en _customers:", data); 
        })

      },
      error: err=>{
        console.log(err);
      }
    })
  }

  loadMoreCustomers(notify:HTMLIonInfiniteScrollElement | null = null){
    if(this.page<=this.pages){
      this.customerService.getAll(this.page, this.pageSize).subscribe({
        next:(response:Paginated<Customer>)=>{
          response.data.forEach(customer => this.loadedIds.add(customer.id));
          this._customers.next([...this._customers.value, ...response.data]);
          this.page++;
          notify?.complete();
        }
      });
    }
    else{
      notify?.complete();
    }
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent) {
    this.loadMoreCustomers(ev.target);
  }

  async openCustomerModal(customer: Customer) {
    const modal = await this.modalCtrl.create({
      component: CustomerModalComponent,
      componentProps: { customer }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const { action, data } = result.data;
        if (action === 'save') {
          this.updateCustomer(customer.id, data);
        } else if (action === 'delete') {
          this.deleteCustomer(customer.id);
        }
      }
    });

    await modal.present();
  }

  updateCustomer(id: string, data: any) {
    this.customerService.update(id.toString(), data).subscribe({
      next: () => this.loadCustomers(),
      error: (err) => console.error(err)
    });
  }

  deleteCustomer(id: string) {
    this.customerService.delete(id.toString()).subscribe({
      next: () => this.loadCustomers(),
      error: (err) => console.error(err)
    });
  }

}
