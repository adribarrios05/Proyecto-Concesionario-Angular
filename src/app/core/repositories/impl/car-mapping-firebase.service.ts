import { Inject, Injectable } from '@angular/core';
import { IBaseMapping } from '../intefaces/base-mapping.interface';
import { Paginated } from '../../models/paginated.model';
import { doc, Firestore, getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG_TOKEN } from '../repository.tokens';
import { initializeApp } from 'firebase/app';
import { Car } from '../../models/car.model';
import { FirebaseCar } from '../../models/firebase/firebase-car.model';

@Injectable({
  providedIn: 'root'
})
export class CarMappingFirebaseService implements IBaseMapping<Car> {
  

  private db: Firestore;

  constructor(@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any){
        this.db = getFirestore(initializeApp(firebaseConfig));
  }
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
      customer: data.customerId?.id,
      picture: data.picture ? {
        url: data.picture,
        large: data.picture,
        medium: data.picture,
        small: data.picture,
        thumbnail: data.picture
      } : undefined
    };
  }

  getPaginated(page: number, pageSize: number, pages: number, data: ({ id: string } & FirebaseCar)[]): Paginated<Car> {
    return {
      page,
      pageSize,
      pages,
      data: data.map(item => this.getOne(item))
    };
  }

  setAdd(data: Car): FirebaseCar {
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
        picture: data.picture ? data.picture.url : ""
    };
    if(dataMapping.customerId){ 
      dataMapping.customerId = doc(this.db, 'customers', data.customer?.toString() || '');
    }
    return dataMapping;
  }

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
    if (data.picture) result.picture = data.picture;

    return result;
  }

  getAdded(data:{id:string} & FirebaseCar): Car {
    return this.getOne(data);
  }

  getUpdated(data:{id:string} & FirebaseCar): Car {
    return this.getOne(data);
  }

  getDeleted(data:{id:string} & FirebaseCar): Car {
    return this.getOne(data);
  }
} 