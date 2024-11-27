import { Injectable } from "@angular/core";
import { Customer } from "../../models/customer.model";
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
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
  }

interface CustomerRaw{
    data: Data,
    meta: Meta
}

interface Data {
    id: number
    attributes: CustomerAttributes
}

interface CustomerData {
    data: CustomerAttributes
}
  
interface CustomerAttributes {
    name: string
    surname: string,
    DNI: string,
    phone: string,
    age: string,
    gender: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
    carRent:CarRaw | number | null,
    appUser:UserRaw | number | null,
    picture:MediaRaw | number | null
}
  

interface CarRaw {
    data: CarData
    meta: Meta
  }
  
interface CarData {
    id: number
    attributes: CarAttributes
}
interface CarData {
    data: CarAttributes;
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
    customerSell: CustomerRaw | number | null,
    createdAt?: string
    updatedAt?: string
    publishedAt?: string,
    picture: MediaRaw | number | null
}

interface Meta {}

@Injectable({
    providedIn: 'root'
  })
  export class CustomerMappingStrapi implements IBaseMapping<Customer> {

    setAdd(data: Customer):CustomerData {
        return {
            data:{
                name: data.name,
                surname: data.surname,
                DNI: data.DNI,
                phone: data.phone,
                age: data.age,
                gender: data.gender,
                carRent: data.carRent ? Number(data.carRent) : null,
                appUser: data.userId ? Number(data.userId) : null,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                publishedAt: "",
                picture: data.picture?Number(data.picture):null
            }
        };
    }
    setUpdate(data: Partial<Customer>): CustomerData {
        const mappedData: Partial<CustomerAttributes> = {};

        Object.keys(data).forEach(key => {
            switch(key){
                case 'name': mappedData.name = data[key];
                break;
                case 'surname': mappedData.surname = data[key];
                break;
                case 'DNI': mappedData.DNI = data[key];
                break;
                case 'phone': mappedData.phone = data[key];
                break;
                case 'age': mappedData.age = data[key];
                break;
                case 'gender': mappedData.gender = data[key];
                break;
                case 'carRent': mappedData.carRent = data[key] ? Number(data[key]) : null;
                break;
                case 'userId': mappedData.appUser = data[key] ? Number(data[key]) : null;
                break;
                case 'picture': mappedData.picture = data[key] ? Number(data[key]) : null;
                break;
            }
        });

        return {
            data: mappedData as CustomerAttributes
        };
    }

    getPaginated(page:number, pageSize: number, pages:number, data:Data[]): Paginated<Customer> {
        return {page:page, pageSize:pageSize, pages:pages, data:data.map<Customer>((d:Data|CustomerRaw)=>{
            return this.getOne(d);
        })};
    }
    getOne(data: Data | CustomerRaw): Customer {
        const isCustomerRaw = (data: Data | CustomerRaw): data is CustomerRaw => 'meta' in data;

        const attributes = isCustomerRaw(data) ? data.data.attributes : data.attributes;
        const id = isCustomerRaw(data) ? data.data.id : data.id;
        
        return {
            id: id.toString(),
            name: attributes.name,
            surname: attributes.surname,
            DNI: attributes.DNI,
            phone: attributes.phone,
            age: attributes.age,
            gender: attributes.gender,
            carRent: typeof attributes.carRent === 'object' ? attributes.carRent?.data?.id/*.toString()*/ : undefined,
            userId: typeof attributes.appUser === 'object' ? attributes.appUser?.data?.id/*.toString()*/ : undefined,
            picture: typeof attributes.picture === 'object' ? {
                url: attributes.picture?.data?.attributes?.url,
                large: attributes.picture?.data?.attributes?.formats?.large?.url || attributes.picture?.data?.attributes?.url,
                medium: attributes.picture?.data?.attributes?.formats?.medium?.url || attributes.picture?.data?.attributes?.url,
                small: attributes.picture?.data?.attributes?.formats?.small?.url || attributes.picture?.data?.attributes?.url,
                thumbnail: attributes.picture?.data?.attributes?.formats?.thumbnail?.url || attributes.picture?.data?.attributes?.url,
            } : undefined
        };
    }
    getAdded(data: CustomerRaw):Customer {
        return this.getOne(data.data);
    }
    getUpdated(data: CustomerRaw):Customer {
        return this.getOne(data.data);
    }
    getDeleted(data: CustomerRaw):Customer {
        return this.getOne(data.data);
    }
  }
  