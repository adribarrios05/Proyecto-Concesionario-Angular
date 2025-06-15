import { Inject, Injectable } from '@angular/core';
import { IBaseMapping } from '../intefaces/base-mapping.interface';
import { Paginated } from '../../models/paginated.model';
import {
  doc,
  DocumentReference,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import { FIREBASE_CONFIG_TOKEN } from '../repository.tokens';
import { initializeApp } from 'firebase/app';
import { Customer } from '../../models/customer.model';
import { FirebaseCustomer } from '../../models/firebase/firebase-customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerMappingFirebaseService implements IBaseMapping<Customer> {
  private db: Firestore;

  constructor(
    //@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any
    @Inject(FIREBASE_CONFIG_TOKEN)
    protected firebaseConfig = {
      apiKey: 'AIzaSyDXjHUKnlhNBpIpfdxOZlAKb1vykp8ElPo',
      authDomain: 'concesionarios-baca.firebaseapp.com',
      projectId: 'concesionarios-baca',
      storageBucket: 'concesionarios-baca.firebasestorage.app',
      messagingSenderId: '1098140390614',
      appId: '1:1098140390614:web:f468fba37feeba8ddea577',
      measurementId: 'G-FWC8EPFFQG',
    }
  ) {
    this.db = getFirestore(initializeApp(firebaseConfig));
  }

  setAdd(data: Customer): FirebaseCustomer {
    let dataMapping: FirebaseCustomer = {
      name: data.name,
      surname: data.surname,
      dni: data.dni,
      phone: data.phone,
      birthDate: data.birthDate,
      user: doc(this.db, `users/${data.user.id}`) as DocumentReference,
      picture:
        typeof data.picture === 'string'
          ? data.picture
          : data.picture?.url ?? '',
      username: data.username ? data.username : '',
      role: data.role && data.role.length > 0 ? data.role : ['cliente'],
    };
    return dataMapping;
  }

  setUpdate(data: Partial<Customer>): FirebaseCustomer {
    const result: any = {};

    if (data.name) result.name = data.name;
    if (data.surname) result.surname = data.surname;
    if (data.dni) result.dni = data.dni;
    if (data.phone) result.phone = data.phone;
    if (data.birthDate) result.birthDate = data.birthDate;
    if (data.user) result.user = data.user || '';
    if (data.picture) result.picture = data.picture;
    if (data.username) result.username = data.username;
    if (data.role) result.role = data.role.length > 0 ? data.role : ['cliente'];

    return result;
  }

  getOne(doc: any): Customer {
    return {
      ...doc,
      picture:
        typeof doc.picture === 'string' ? doc.picture : doc.picture?.url ?? '',
        birthDate: doc.birthDate?.toDate ? doc.birthDate.toDate() : new Date(doc.birthDate),
    };
  }

  getPaginated(
    page: number,
    pageSize: number,
    total: number,
    data: ({ id: string } & FirebaseCustomer)[]
  ): Paginated<Customer> {
    return {
      page,
      pageSize,
      pages: Math.ceil(total / pageSize),
      data: data.map((item) => this.getOne(item)),
    };
  }

  getAdded(item: Customer): any {
    return {
      ...item,
      picture:
        typeof item.picture === 'string'
          ? item.picture
          : item.picture?.url ?? '',
    };
  }

  getUpdated(data: any): Customer {
    return this.getAdded(data);
  }

  getDeleted(data: { id: string } & FirebaseCustomer): Customer {
    return this.getOne(data);
  }
}
