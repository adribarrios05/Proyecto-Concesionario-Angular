/*import { Injectable, Inject } from '@angular/core';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { BaseRepositoryFirebaseService } from './base-repository-firebase.service';
import { Customer } from '../../models/customer.model';
import { FIREBASE_COLLECTION_TOKEN, FIREBASE_CONFIG_TOKEN, REPOSITORY_MAPPING_TOKEN } from '../repository.tokens';
import { IBaseMapping } from '../intefaces/base-mapping.interface';
import { ICustomerRepository } from '../intefaces/customer-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerFirebaseRepositoryService extends BaseRepositoryFirebaseService<Customer> implements ICustomerRepository { 

  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) firebaseConfig: any,
    @Inject(FIREBASE_COLLECTION_TOKEN) collectionName: string,
    @Inject(REPOSITORY_MAPPING_TOKEN) mapping: IBaseMapping<Customer>
  ) {
    super(firebaseConfig, collectionName, mapping); 
  }

  getCustomerWithUser(customerId: number): Observable<Customer> {
    const customerDocRef = doc(this.db, this.collectionName, customerId.toString());
    return from(getDoc(customerDocRef)).pipe(
      map(docSnapshot => {
        if (!docSnapshot.exists()) {
          throw new Error(`No se encontró el cliente con ID ${customerId}`);
        }
        return this.mapping.getOne({ id: docSnapshot.id, ...docSnapshot.data() } as Customer);
      })
    );
  }

  getByUserId(userId: string): Observable<Customer | null> {
    console.log("📌 getByUserId() en CustomerFirebaseRepositoryService - Buscando usuario con ID:", userId);
    
    const customersCollectionRef = collection(this.db, this.collectionName);
    const q = query(customersCollectionRef, where("user", "==", userId));
  
    return from(getDocs(q)).pipe(
      map(querySnapshot => {
        console.log("📌 Número de clientes encontrados:", querySnapshot.size);
        if (querySnapshot.empty) {
          console.warn("⚠️ No se encontró ningún cliente con ese userId.");
          return null; 
        }
        const customerDoc = querySnapshot.docs[0];
        console.log("📌 Cliente encontrado:", customerDoc.data());
        return this.mapping.getOne({ id: customerDoc.id, ...customerDoc.data() } as Customer);
      })
    );
  }
  
}*/
