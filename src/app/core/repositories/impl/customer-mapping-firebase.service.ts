import { Inject, Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { doc, DocumentReference, Firestore, getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN } from "../repository.tokens";
import { initializeApp } from "firebase/app";
import { Customer } from "../../models/customer.model";
import { FirebaseCustomer } from "../../models/firebase/firebase-customer.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerMappingFirebaseService implements IBaseMapping<Customer> {

  private db: Firestore;

  constructor(
    //@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any
    @Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig = {
      apiKey: "AIzaSyDXjHUKnlhNBpIpfdxOZlAKb1vykp8ElPo",
      authDomain: "concesionarios-baca.firebaseapp.com",
      projectId: "concesionarios-baca",
      storageBucket: "concesionarios-baca.firebasestorage.app",
      messagingSenderId: "1098140390614",
      appId: "1:1098140390614:web:f468fba37feeba8ddea577",
      measurementId: "G-FWC8EPFFQG"
    },
  ){
    console.log("Configuracion Firebase: ", firebaseConfig)
        this.db = getFirestore(initializeApp(firebaseConfig));
  }

  setAdd(data: Customer): FirebaseCustomer {
    let dataMapping:FirebaseCustomer = {
      name: data.name,
      surname: data.surname,
      dni: data.dni,
      phone: data.phone,
      birthDate: data.birthDate,
      user: data.userId?.toString() || '',
      picture: data.picture ? data.picture.url : ''
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
    if (data.userId) result.user = data.userId || '';
    if (data.picture) result.picture = data.picture;

    return result;
  }

  getOne(data: { id: string } & FirebaseCustomer): Customer {
    return {
      id: data.id,
      name: data.name,
      surname: data.surname,
      dni: data.dni,
      phone: data.phone,
      birthDate: data.birthDate,
      userId: data.user?.toString() || '',
      picture: data.picture ? {
        url: data.picture,
        large: data.picture,
        medium: data.picture,
        small: data.picture,
        thumbnail: data.picture
      } : undefined
    };
  }

  getPaginated(page: number, pageSize: number, total: number, data: ({id:string} & FirebaseCustomer)[]): Paginated<Customer> {
    return {
      page,
      pageSize,
      pages: Math.ceil(total / pageSize),
      data: data.map(item => this.getOne(item))
    };
  }

  getAdded(data: {id:string} & FirebaseCustomer): Customer {
    return this.getOne(data);
  }

  getUpdated(data: {id:string} & FirebaseCustomer): Customer {
    return this.getOne(data);
  }

  getDeleted(data: {id:string} & FirebaseCustomer): Customer {
    return this.getOne(data);
  }
} 