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
  where
} from 'firebase/firestore';
import { from, map, Observable, mergeMap } from 'rxjs';
import { IBaseRepository, SearchParams } from '../intefaces/base-repository.interface';
import { FIREBASE_CONFIG_TOKEN, FIREBASE_COLLECTION_TOKEN, REPOSITORY_MAPPING_TOKEN } from '../repository.tokens';
import { Model } from '../../models/base.model';
import { IBaseMapping } from '../intefaces/base-mapping.interface';
import { Paginated } from '../../models/paginated.model';

@Injectable({
  providedIn: 'root'
})
export class BaseRepositoryFirebaseService<T extends Model> implements IBaseRepository<T> {
  protected db;
  private collectionRef;

  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig = {
      apiKey: "AIzaSyDXjHUKnlhNBpIpfdxOZlAKb1vykp8ElPo",
      authDomain: "concesionarios-baca.firebaseapp.com",
      projectId: "concesionarios-baca",
      storageBucket: "concesionarios-baca.firebasestorage.app",
      messagingSenderId: "1098140390614",
      appId: "1:1098140390614:web:f468fba37feeba8ddea577",
      measurementId: "G-FWC8EPFFQG"
    },
    @Inject(FIREBASE_COLLECTION_TOKEN) protected collectionName: string,
    @Inject(REPOSITORY_MAPPING_TOKEN) protected mapping: IBaseMapping<T>
  ) {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.collectionRef = collection(this.db, this.collectionName);
  }

  private async getLastDocumentOfPreviousPage(page: number, pageSize: number) {
    if (page <= 1) return null;
    
    const previousPageQuery = query(
      this.collectionRef,
      limit((page - 1) * pageSize)
    );
    
    const snapshot = await getDocs(previousPageQuery);
    const docs = snapshot.docs;
    return docs[docs.length - 1];
  }

  getAll(page: number, pageSize: number, filters: SearchParams): Observable<T[] | Paginated<T>> {
    return from(this.getLastDocumentOfPreviousPage(page, pageSize)).pipe(
      map(lastDoc => {
        const constraints: QueryConstraint[] = [
          limit(pageSize)
        ];

        Object.entries(filters).forEach(([key, value]) => {
          constraints.push(where(key, "==", value));
        });

        console.log("Filtros aplicados en getAll(): ", filters)
        
        if (lastDoc) {
          constraints.push(startAfter(lastDoc));
        }
        
        return query(this.collectionRef, ...constraints);
      }),
      mergeMap(q => getDocs(q)),
      map(snapshot => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return this.mapping.getPaginated(page, pageSize, snapshot.size, items as T[]);
      })
    );
  }

  getById(id: string): Observable<T | null> {
    const docRef = doc(this.db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return this.mapping.getOne({ id: doc.id, ...doc.data() } as T);
        }
        return null;
      })
    );
  }

  add(entity: T): Observable<T> {
    const entityData = { ...this.mapping.setAdd(entity) };

    if (!entityData.picture || entityData.picture === undefined) {
      console.warn("⚠️ No se ha encontrado la imagen antes de guardar el coche en Firestore.");
    } else {
      console.log("✅ Imagen detectada antes de guardar en Firestore:", entityData.picture);
    }
    
  
    return from(addDoc(this.collectionRef, entityData)).pipe(
      map(docRef => {
      console.log("✅ Coche guardado en Firestore con imagen:", entityData.picture);
      return this.mapping.getAdded({ ...entity, id: docRef.id } as T);
    })
    );
  }
  

  update(id: string, entity: T): Observable<T> {
    const docRef = doc(this.db, this.collectionName, id);
    
    return from(updateDoc(docRef, this.mapping.setUpdate(entity))).pipe(
      map(() => this.mapping.getUpdated({ ...entity, id } as T))
    );
  }

  delete(id: string): Observable<T> {
    const docRef = doc(this.db, this.collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(doc => ({ id: doc.id, ...doc.data() } as T)),
      map(entity => {
        deleteDoc(docRef);
        return this.mapping.getDeleted(entity);
      })
    );
  }
} 