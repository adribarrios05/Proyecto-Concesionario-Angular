import { Inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  limit,
  startAt,
  startAfter,
  QueryConstraint,
  orderBy,
  or,
  where,
  setDoc,
} from 'firebase/firestore';
import { from, map, Observable, mergeMap } from 'rxjs';
import {
  IBaseRepository,
  SearchParams,
} from '../intefaces/base-repository.interface';
import {
  FIREBASE_CONFIG_TOKEN,
  FIREBASE_COLLECTION_TOKEN,
  REPOSITORY_MAPPING_TOKEN,
} from '../repository.tokens';
import { Model } from '../../models/base.model';
import { IBaseMapping } from '../intefaces/base-mapping.interface';
import { Paginated } from '../../models/paginated.model';

/**
 * Servicio base para repositorios que utilizan Firebase como backend.
 * Proporciona operaciones CRUD y paginación con filtros.
 *
 * @export
 * @class BaseRepositoryFirebaseService
 * @template T Tipo de modelo que extiende de Model
 */
@Injectable({
  providedIn: 'root',
})
export class BaseRepositoryFirebaseService<T extends Model>
  implements IBaseRepository<T>
{
  /**
   * Instancia de Firestore inicializada.
   */
  protected db;

  /**
   * Referencia a la colección de Firestore específica para la entidad T.
   */
  private collectionRef;

  /**
   * Constructor que inyecta la configuración de Firebase, el nombre de la colección y el mapeador de datos.
   *
   * @param firebaseConfig Configuración del proyecto Firebase
   * @param collectionName Nombre de la colección de Firestore
   * @param mapping Servicio de mapeo de datos para T
   */
  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN)
    protected firebaseConfig = {
      apiKey: 'AIzaSyDXjHUKnlhNBpIpfdxOZlAKb1vykp8ElPo',
      authDomain: 'concesionarios-baca.firebaseapp.com',
      projectId: 'concesionarios-baca',
      storageBucket: 'concesionarios-baca.firebasestorage.app',
      messagingSenderId: '1098140390614',
      appId: '1:1098140390614:web:f468fba37feeba8ddea577',
      measurementId: 'G-FWC8EPFFQG',
    },
    @Inject(FIREBASE_COLLECTION_TOKEN) protected collectionName: string,
    @Inject(REPOSITORY_MAPPING_TOKEN) protected mapping: IBaseMapping<T>
  ) {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.collectionRef = collection(this.db, this.collectionName);
  }

  /**
   * Recupera el último documento de la página anterior para aplicar paginación basada en cursores.
   *
   * @private
   * @param page Página actual
   * @param pageSize Tamaño de página
   * @param filters Filtros de búsqueda
   * @param orderField Campo por el que se ordena
   * @returns Último documento de la página anterior
   */
  private async getLastDocumentOfPreviousPage(
    page: number,
    pageSize: number,
    filters: SearchParams,
    orderField: string
  ) {
    if (page <= 1) return null;

    const constraints: QueryConstraint[] = [
      orderBy(orderField),
      limit((page - 1) * pageSize),
    ];

    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if ('$gte' in value && '$lte' in value) {
          constraints.push(where(key, '>=', value.$gte));
          constraints.push(where(key, '<=', value.$lte));
        } else if ('$gte' in value) {
          constraints.push(where(key, '>=', value.$gte));
        } else if ('$lte' in value) {
          constraints.push(where(key, '<=', value.$lte));
        } else if ('$in' in value) {
          constraints.push(where(key, 'in', value.$in));
        }
      } else {
        constraints.push(where(key, '==', value));
      }
    });

    const snapshot = await getDocs(query(this.collectionRef, ...constraints));
    return snapshot.docs[snapshot.docs.length - 1];
  }

  /**
   * Obtiene una página de elementos aplicando filtros y paginación.
   *
   * @param page Número de página a obtener
   * @param pageSize Cantidad de elementos por página
   * @param filters Filtros aplicados sobre los campos
   * @param orderField Campo por el que se ordena (por defecto 'id')
   * @returns Observable con los resultados paginados
   */
  getAll(
    page: number,
    pageSize: number,
    filters: SearchParams,
    orderField: string = 'id'
  ): Observable<T[] | Paginated<T>> {

    return from(
      this.getLastDocumentOfPreviousPage(page, pageSize, filters, orderField)
    ).pipe(
      map((lastDoc) => {
        const constraints: QueryConstraint[] = [
          orderBy(orderField),
          limit(pageSize),
        ];

        if (lastDoc) {
          constraints.push(startAfter(lastDoc));
          console.log(`🔁 startAfter aplicado desde documento:`, lastDoc.id);
        }

        Object.entries(filters).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            if ('$gte' in value && '$lte' in value) {
              constraints.push(where(key, '>=', value.$gte));
              constraints.push(where(key, '<=', value.$lte));
            } else if ('$gte' in value) {
              constraints.push(where(key, '>=', value.$gte));
            } else if ('$lte' in value) {
              constraints.push(where(key, '<=', value.$lte));
            } else if ('$in' in value) {
              constraints.push(where(key, 'in', value.$in));
            }
          } else {
            constraints.push(where(key, '==', value));
          }
        });

        console.log('📦 Filtros aplicados en Firebase:', filters);
        return query(this.collectionRef, ...constraints);
      }),
      mergeMap((q) => getDocs(q)),
      map((snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(
          `📄 Documentos obtenidos para página ${page}:`,
          items.length
        );

        return this.mapping.getPaginated(
          page,
          pageSize,
          snapshot.size,
          items as T[]
        );
      })
    );
  }

  /**
   * Obtiene un elemento por su ID.
   *
   * @param id Identificador del documento
   * @returns Observable con el documento encontrado o null
   */
  getById(id: string): Observable<T | null> {
    const docRef = doc(this.db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map((doc) => {
        if (doc.exists()) {
          return this.mapping.getOne({ id: doc.id, ...doc.data() } as T);
        }
        return null;
      })
    );
  }

  /**
   * Añade un nuevo documento a la colección.
   *
   * @param entity Objeto de tipo T a añadir
   * @returns Observable con el objeto añadido
   */
  add(entity: T): Observable<T> {
    const entityData = { ...this.mapping.setAdd(entity) };

    if (entity.id) {
      const docRef = doc(this.db, this.collectionName, entity.id);
      return from(setDoc(docRef, entityData)).pipe(
        map(() => this.mapping.getAdded({ ...entity, id: entity.id } as T))
      );
    } else {
      return from(addDoc(this.collectionRef, entityData)).pipe(
        map((docRef) =>
          this.mapping.getAdded({ ...entity, id: docRef.id } as T)
        )
      );
    }
  }

  /**
   * Actualiza un documento por su ID.
   *
   * @param id Identificador del documento
   * @param entity Objeto con los datos actualizados
   * @returns Observable con el objeto actualizado
   */
  update(id: string, entity: T): Observable<T> {
    const updatedData = this.mapping.setUpdate(entity);

    console.log('🔄 Actualizando coche en Firebase con datos:', updatedData);

    if (!updatedData.customer) {
      console.warn(
        '⚠️ customerId está vacío o undefined. Verifica si se está pasando correctamente.'
      );
    }

    const docRef = doc(this.db, this.collectionName, id);

    return from(updateDoc(docRef, updatedData)).pipe(
      map(() => {
        console.log(
          `✅ Coche actualizado correctamente en Firebase con customerId: ${updatedData.customerId}`
        );
        return this.mapping.getUpdated({ ...entity, id } as T);
      })
    );
  }

  /**
   * Elimina un documento por su ID.
   *
   * @param id Identificador del documento a eliminar
   * @returns Observable con el objeto eliminado
   */
  delete(id: string): Observable<T> {
    const docRef = doc(this.db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map((doc) => ({ id: doc.id, ...doc.data() } as T)),
      map((entity) => {
        deleteDoc(docRef);
        return this.mapping.getDeleted(entity);
      })
    );
  }
}
