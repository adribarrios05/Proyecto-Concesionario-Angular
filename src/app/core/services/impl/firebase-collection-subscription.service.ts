import { Inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { FIREBASE_CONFIG_TOKEN, REPOSITORY_MAPPING_TOKEN } from '../../repositories/repository.tokens';
import { Model } from '../../models/base.model';
import { IBaseMapping } from '../../repositories/intefaces/base-mapping.interface';
import { ICollectionSubscription, CollectionChange } from '../interfaces/collection-subscription.interface';

/**
 * Servicio para suscribirse en tiempo real a colecciones de Firebase Firestore.
 *
 * @export
 * @class FirebaseCollectionSubscriptionService
 * @template T Tipo de modelo extendido de `Model`
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseCollectionSubscriptionService<T extends Model> implements ICollectionSubscription<T> {

  /**
   * Instancia de Firestore.
   */
  private db;

  /**
   * Mapa de subjects para cada colección suscrita.
   */
  private subscriptions: Map<string, Subject<CollectionChange<T>>> = new Map();

  /**
   * Mapa de funciones de desuscripción activas.
   */
  private unsubscribeFunctions: Map<string, () => void> = new Map();

  /**
   * Inicializa Firestore y almacena el mapeador inyectado.
   *
   * @param firebaseConfig Configuración del proyecto Firebase
   * @param mapping Mapeador de datos
   */
  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any,
    @Inject(REPOSITORY_MAPPING_TOKEN) protected mapping: IBaseMapping<T>
  ) {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  /**
   * Se suscribe a una colección de Firestore y emite cambios en tiempo real.
   *
   * @param collectionName Nombre de la colección
   * @returns Observable con los cambios de tipo `CollectionChange<T>`
   */
  subscribe(collectionName: string): Observable<CollectionChange<T>> {
    if (this.subscriptions.has(collectionName)) {
      return this.subscriptions.get(collectionName)!.asObservable();
    }

    const subject = new Subject<CollectionChange<T>>();
    this.subscriptions.set(collectionName, subject);

    const unsubscribe = onSnapshot(
      collection(this.db, collectionName),
      (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.docChanges().forEach(change => {
          const changeData: CollectionChange<T> = {
            type: change.type as 'added' | 'modified' | 'removed',
            id: change.doc.id
          };

          if (change.type !== 'removed') {
            changeData.data = this.mapping.getOne({
              id: change.doc.id,
              ...change.doc.data()
            } as T);
          }

          subject.next(changeData);
        });
      },
      error => {
        console.error(`Error en suscripción a ${collectionName}:`, error);
        subject.error(error);
      }
    );

    this.unsubscribeFunctions.set(collectionName, unsubscribe);
    return subject.asObservable();
  }

  /**
   * Finaliza la suscripción activa a una colección específica.
   *
   * @param collectionName Nombre de la colección a desuscribir
   */
  unsubscribe(collectionName: string): void {
    const unsubscribe = this.unsubscribeFunctions.get(collectionName);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribeFunctions.delete(collectionName);
    }

    const subject = this.subscriptions.get(collectionName);
    if (subject) {
      subject.complete();
      this.subscriptions.delete(collectionName);
    }
  }

  /**
   * Elimina todas las suscripciones activas (se invoca al destruir el servicio).
   */
  ngOnDestroy() {
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.forEach(subject => subject.complete());
    this.unsubscribeFunctions.clear();
    this.subscriptions.clear();
  }
}
