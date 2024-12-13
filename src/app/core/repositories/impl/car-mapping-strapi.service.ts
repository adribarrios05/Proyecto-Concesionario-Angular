import { Injectable } from "@angular/core";
import { Car } from "../../models/car.model";
import { Paginated } from "../../models/paginated.model";
import { StrapiMedia } from "../../services/impl/strapi-media.service";
import { IBaseMapping } from "../intefaces/base-mapping.interface";


interface MediaRaw{
    data: StrapiMedia
}
interface UserRaw{
    data: UserData
}

interface UserData{
    id: number
    attributes: UserAttributes
}

interface UserAttributes {
    username: string
    email: string
    imageUrl: string,
    customerId: string
  }

interface CarRaw{
    data: Data,
    meta: Meta
}

interface Data {
    id: number
    attributes: CarAttributes
}

interface CarData {
    data: CarAttributes
}
  
interface CarAttributes {
    brand: string,
    model: string,
    horsePower: number,
    doors: number,
    description: string,
    color: string,
    type: string,
    price: number,
    plate: string,
    customer: CustomerRaw | number | null,
    createdAt?: string
    updatedAt?: string
    publishedAt?: string,
    picture: MediaRaw | number | null
}
  

interface CustomerRaw {
    data: CustomerData
    meta: Meta
  }
  
interface CustomerData {
    id: number
    attributes: CustomerAttributes
}
interface CustomerData {
    data: CustomerAttributes;
}

interface CustomerAttributes {
    name: string
    surname: string,
    DNI: string,
    phone: string,
    age: Date,
    gender: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
    carRent:CarRaw | number | null,
    appUser:UserRaw | number | null,
    picture:MediaRaw | number | null
}

interface Meta {}

@Injectable({
    providedIn: 'root'
  })
  export class CarMappingStrapi implements IBaseMapping<Car> {

    setAdd(data: Car) {
        return {
            data:{
                brand: data.brand,
                model: data.model,
                horsePower: data.horsePower,
                doors: data.doors,
                description: data.description,
                color: data.color,
                type: data.type,
                price: data.price,
                plate: data.plate,
                customer: {id: data.customer},
                picture: data.picture?Number(data.picture):null
            }
        };
    }
    setUpdate(data: Partial<Car>): CarData {
        const mappedData: Partial<CarAttributes> = {};

        Object.keys(data).forEach(key => {
            switch(key){
                case 'brand': mappedData.brand = data[key];
                break;
                case 'model': mappedData.model = data[key];
                break;
                case 'horsePower': mappedData.horsePower = data[key];
                break;
                case 'doors': mappedData.doors = data[key];
                break;
                case 'description': mappedData.description = data[key];
                break;
                case 'color': mappedData.color = data[key];
                break;
                case 'type': mappedData.type = data[key];
                break;
                case 'price': mappedData.price = data[key];
                break;
                case 'plate': mappedData.plate = data[key];
                break;
                case 'customer': mappedData.customer = data[key] ? Number(data[key]) : null;
                break;
                case 'picture': mappedData.picture = data[key] ? Number(data[key]) : null;
                break;
            }
        });

        return {
            data: mappedData as CarAttributes
        };
    }

    getPaginated(page:number, pageSize: number, pages:number, data:Data[]): Paginated<Car> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Car>((d:Data|CarRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: Data | CarRaw): Car {
        const isCarRaw = (data: Data | CarRaw): data is CarRaw => 'meta' in data;

        const attributes = isCarRaw(data) ? data.data.attributes : data.attributes;
        const id = isCarRaw(data) ? data.data.id : data.id;
        
        return {
            id: id.toString(),
            brand: attributes.brand,
            model: attributes.model,
            horsePower: attributes.horsePower,
            doors: attributes.doors,
            description: attributes.description,
            color: attributes.color,
            type: attributes.type,
            price: attributes.price,
            plate: attributes.plate,
            customer: typeof attributes.customer === 'object' ? attributes.customer?.data?.id : undefined,
            picture: typeof attributes.picture === 'object' ? {
                url: attributes.picture?.data?.attributes?.url,
                large: attributes.picture?.data?.attributes?.formats?.large?.url || attributes.picture?.data?.attributes?.url,
                medium: attributes.picture?.data?.attributes?.formats?.medium?.url || attributes.picture?.data?.attributes?.url,
                small: attributes.picture?.data?.attributes?.formats?.small?.url || attributes.picture?.data?.attributes?.url,
                thumbnail: attributes.picture?.data?.attributes?.formats?.thumbnail?.url || attributes.picture?.data?.attributes?.url,
            } : undefined
        };
    }
    getAdded(data: CarRaw):Car {
        return this.getOne(data.data);
    }
    getUpdated(data: CarRaw):Car {
        return this.getOne(data.data);
    }
    getDeleted(data: CarRaw):Car {
        return this.getOne(data.data);
    }
  }
  