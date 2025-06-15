import { Inject, Injectable } from '@angular/core';
import { IBaseMapping } from '../intefaces/base-mapping.interface';
import { Paginated } from '../../models/paginated.model';
import { doc, Firestore, getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG_TOKEN } from '../repository.tokens';
import { initializeApp } from 'firebase/app';
import { Car } from '../../models/car.model';
import { FirebaseCar } from '../../models/firebase/firebase-car.model';

/**
 * Servicio de mapeo entre el modelo `Car` y el modelo utilizado en Firebase (`FirebaseCar`).
 * Implementa `IBaseMapping` para proporcionar las funciones de transformación necesarias.
 *
 * @export
 * @class CarMappingFirebaseService
 */
@Injectable({
  providedIn: 'root'
})
export class CarMappingFirebaseService implements IBaseMapping<Car> {
  /**
   * Instancia de Firestore usada para generar referencias.
   */
  db: Firestore;

  /**
   * Inicializa Firestore con la configuración inyectada.
   * @param firebaseConfig Configuración del proyecto Firebase
   */
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
  ){
        this.db = getFirestore(initializeApp(firebaseConfig));
  }

  /**
   * Convierte un objeto de tipo FirebaseCar con ID en un objeto `Car`.
   * @param data Objeto proveniente de Firebase
   * @returns Objeto mapeado de tipo Car
   */
  getOne(data: { id: string } & FirebaseCar): Car {
    return {
      id: data.id,
      brand: data.brand,
      model: data.model,
      price: data.price,
      doors: data.doors,
      description: data.description,
      horsePower: data.horsePower,
      color: data.color,
      type: data.type,
      plate: data.plate,
      customer: data.customer?.id,
      picture: data.picture ? {
        url: data.picture,
        large: data.picture,
        medium: data.picture,
        small: data.picture,
        thumbnail: data.picture
      } : undefined,
      createdAt: new Date().toString()
    };
  }

  /**
   * Convierte un listado paginado de objetos FirebaseCar a `Car`.
   * @param page Página actual
   * @param pageSize Tamaño de la página
   * @param pages Total de páginas
   * @param data Lista de objetos FirebaseCar
   * @returns Paginado de objetos `Car`
   */
  getPaginated(page: number, pageSize: number, pages: number, data: ({ id: string } & FirebaseCar)[]): Paginated<Car> {
    return {
      page,
      pageSize,
      pages,
      data: data.map(item => this.getOne(item))
    };
  }

   /**
   * Convierte un objeto `Car` en un objeto `FirebaseCar` para ser añadido a Firebase.
   * @param data Objeto `Car`
   * @returns Objeto mapeado `FirebaseCar`
   */
  setAdd(data: Car): FirebaseCar {
    console.log("Data del mapping: ", data);
    console.log("Imagen del mapping: ", data.picture) 
    console.log("Tipo de la imagen: ", typeof data.picture)

    let imageUrl: string = ""

    if (typeof data.picture === "string") {
      imageUrl = data.picture;
  } else if (typeof data.picture === "object" && data.picture.url) {
      imageUrl = data.picture.url;
  } else {
      console.warn("⚠️ No se encontró imagen válida en `data.picture`. Se guardará vacío.");
  }

    let dataMapping:FirebaseCar = {
        brand: data.brand,
        model: data.model,
        price: data.price,
        doors: data.doors,
        description: data.description,
        horsePower: data.horsePower,
        color: data.color,
        type: data.type,
        plate: data.plate,
        picture: imageUrl,
        customer: null
    };
    console.log("Data despues de mapear: ", dataMapping)
    return dataMapping;
  }

  /**
   * Convierte un objeto `Car` en una estructura parcial `FirebaseCar` para actualizar en Firebase.
   * @param data Objeto `Car`
   * @returns Objeto parcial para actualización
   */
  setUpdate(data: Car): FirebaseCar {
    const result: any = {};
    
    if (data.brand) result.brand = data.brand;
    if (data.model) result.model = data.model;
    if (data.price) result.price = data.price;
    if (data.doors) result.doors = data.doors;
    if (data.description) result.description = data.description;
    if (data.horsePower) result.horsePower = data.horsePower;
    if (data.color) result.color = data.color;
    if (data.type) result.type = data.type;
    if (data.plate) result.plate = data.plate;
    if (data.customer) result.customer = doc(this.db, 'customers', data.customer.toString() || '');
    if (data.picture) result.picture = data.picture?.url || ' ';

    return result;
  }

  /**
   * Devuelve un objeto `Car` transformado desde el añadido.
   * @param data Datos del objeto añadido
   * @returns Objeto `Car`
   */
  getAdded(data:{id:string} & FirebaseCar): Car {
    return this.getOne(data);
  }

  /**
   * Devuelve un objeto `Car` transformado desde la actualización.
   * @param data Datos del objeto actualizado
   * @returns Objeto `Car`
   */
  getUpdated(data:{id:string} & FirebaseCar): Car {
    return this.getOne(data);
  }

   /**
   * Devuelve un objeto `Car` transformado desde la eliminación.
   * @param data Datos del objeto eliminado
   * @returns Objeto `Car`
   */
  getDeleted(data:{id:string} & FirebaseCar): Car {
    return this.getOne(data);
  }
} 