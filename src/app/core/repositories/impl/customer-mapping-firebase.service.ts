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

/**
 * Servicio de mapeo para clientes con Firebase.
 * Transforma los datos entre el modelo interno `Customer` y el formato de Firebase.
 *
 * @export
 * @class CustomerMappingFirebaseService
 * @implements {IBaseMapping<Customer>}
 */

@Injectable({
  providedIn: 'root',
})
export class CustomerMappingFirebaseService implements IBaseMapping<Customer> {
  private db: Firestore;

  /**
   * Inicializa el servicio y configura Firestore.
   * @param firebaseConfig Configuración de Firebase inyectada
   */
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

  /**
   * Transforma un objeto `Customer` al formato `FirebaseCustomer` para ser añadido.
   * @param data Objeto de tipo Customer
   * @returns Objeto mapeado para Firebase
   */
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

  /**
   * Transforma parcialmente un objeto `Customer` para actualización en Firebase.
   * @param data Datos parciales del cliente
   * @returns Objeto parcial mapeado
   */
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

  /**
   * Transforma un documento de Firebase a un objeto `Customer`.
   * @param doc Documento obtenido de Firestore
   * @returns Cliente mapeado
   */
  getOne(doc: any): Customer {
    return {
      ...doc,
      picture:
        typeof doc.picture === 'string' ? doc.picture : doc.picture?.url ?? '',
        birthDate: doc.birthDate?.toDate ? doc.birthDate.toDate() : new Date(doc.birthDate),
    };
  }

  /**
   * Transforma un conjunto paginado de datos Firebase a un paginado de `Customer`.
   * @param page Página actual
   * @param pageSize Tamaño de página
   * @param total Total de elementos
   * @param data Datos de Firebase
   * @returns Paginado de clientes
   */
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

  /**
   * Devuelve el objeto tras ser añadido.
   * @param item Cliente añadido
   * @returns Cliente transformado
   */
  getAdded(item: Customer): any {
    return {
      ...item,
      picture:
        typeof item.picture === 'string'
          ? item.picture
          : item.picture?.url ?? '',
    };
  }

  /**
   * Devuelve el objeto tras ser actualizado.
   * @param data Cliente actualizado
   * @returns Cliente transformado
   */
  getUpdated(data: any): Customer {
    return this.getAdded(data);
  }

  /**
   * Devuelve el objeto tras ser eliminado.
   * @param data Cliente eliminado
   * @returns Cliente transformado
   */
  getDeleted(data: { id: string } & FirebaseCustomer): Customer {
    return this.getOne(data);
  }
}
