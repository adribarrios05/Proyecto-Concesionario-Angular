import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfiniteScrollCustomEvent, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { CustomerModalComponent } from 'src/app/components/customer-modal/customer-modal.component';
import { User } from 'src/app/core/models/auth.model';
import { Customer } from 'src/app/core/models/customer.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';
import { CustomerService } from 'src/app/core/services/impl/customer.service';

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
  constructor(
    private customerService: CustomerService,
    private modalCtrl: ModalController,
    private platform: Platform
  ) {
    this.isWeb = this.platform.is('desktop')
  }

  ngOnInit() {
    this.loadCustomers()
  }

  page: number = 1
  pageSize: number = 20
  pages: number = 0

  loadCustomers(){
    this.page = 1
    this.customerService.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Customer>) => {

        const userData = response.data.map((customer) => {
          const userId = customer.userId
        })

        this._customers.next([...response.data])
        this.page++
        this.pages = response.pages
      }
    })
  }

  loadMoreCustomers(notify:HTMLIonInfiniteScrollElement | null = null){
    if(this.page<=this.pages){
      this.customerService.getAll(this.page, this.pageSize).subscribe({
        next:(response:Paginated<Customer>)=>{
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
