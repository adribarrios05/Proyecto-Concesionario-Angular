import { Injectable } from "@angular/core";
import { Customer } from "../../models/customer.model";
import { Paginated } from "../../models/paginated.model";
import { StrapiMedia } from "../../services/impl/strapi-media.service";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { map } from "rxjs";



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

export interface CustomerRaw{
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
    dni: string,
    phone: string,
    age: Date,
    /*createdAt?: string
    updatedAt?: string
    publishedAt?: string
    carRent:CarRaw | number | null,*/
    userId:UserRaw | number | null,
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
    customer: CustomerRaw | number | null,
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

    setAdd(data: any):any {
        const formatToISODate = (date: string): Date => {
            const [day, month, year] = date.split('-');
            return new Date(Number(month) - 1, Number(day) , Number(year));; 
          };
        console.log('Datos recibidos en setAdd:', data);

        const miCustomer = {
            data:{
                name: data.name,
                surname: data.surname,
                dni: data.dni,
                phone: data.phone,
                age: formatToISODate(data.age.toString()),
                //carRent: data.carRent ? Number(data.carRent) : null,
                user: data.userId ? Number(data.userId) : null,
                picture: data.picture ? Number(data.picture) : null
            }
        }
        console.log("Pongo un texto cualquiera: ", miCustomer)
        return miCustomer
            
        };

    setUpdate(data: Partial<Customer>): CustomerData {
        const mappedData: Partial<CustomerAttributes> = {};

        Object.keys(data).forEach(key => {
            switch(key){
                case 'name': mappedData.name = data[key];
                break;
                case 'surname': mappedData.surname = data[key];
                break;
                case 'dni': mappedData.dni = data[key];
                break;
                case 'phone': mappedData.phone = data[key];
                break;
                case 'age': mappedData.age = data[key];
                break;
                //case 'carRent': mappedData.carRent = data[key] ? Number(data[key]) : null;
                //break;
                case 'userId': mappedData.userId = data[key] ? Number(data[key]) : null;
                break;
                case 'picture': mappedData.picture = data[key] ? Number(data[key]) : null;
                break;
            }
        });

        return {
            data: mappedData as CustomerAttributes
        };
    }

    getPaginated(page: number, pageSize: number, pages: number, data: Data[]): Paginated<Customer> {
        console.log("📌 Data recibida en getPaginated:", data);
    
        if (!Array.isArray(data) || data.length === 0) {
            console.error("⚠️ Error: data no es un array o está vacía:", data);
            return { page, pageSize, pages, data: [] };
        }
    
        const mappedData = data.map<Customer>((d: Data | CustomerRaw) => {
            const transformed = this.getOne(d);
            console.log("🔄 Transformación de item en getOne:", transformed);
            return transformed;
        });
    
        console.log("✅ Datos después de mapeo en getPaginated:", mappedData);
    
        return {
            page,
            pageSize,
            pages,
            data: mappedData
        };
    }
    
    
    getOne(data: any): Customer {
        console.log("📌 Data recibida en getOne:", data);
    
        if (!data) {
            console.error("❌ Error: data en getOne es undefined o null", data);
        }
    
        const isCustomerRaw = (data: any): data is CustomerRaw => 'meta' in data;
    
        const attributes = isCustomerRaw(data) ? data.data.attributes : data.attributes;
        const id = isCustomerRaw(data) ? data.data.id : data.id;
    
        console.log("📌 Atributos obtenidos:", attributes);
        console.log("📌 ID obtenido:", id);
    
        return {
            id: id ? id.toString() : "0",
            name: attributes?.name || "Sin nombre",
            surname: attributes?.surname || "Sin apellido",
            dni: attributes?.dni || "Sin DNI",
            phone: attributes?.phone || "Sin teléfono",
            age: attributes?.age || 0,
            userId: attributes?.userId?.data?.id || undefined,
            picture: attributes?.picture?.data ? {
                url: attributes.picture.data.attributes.url,
                large: attributes.picture.data.attributes.formats?.large?.url || attributes.picture.data.attributes.url,
                medium: attributes.picture.data.attributes.formats?.medium?.url || attributes.picture.data.attributes.url,
                small: attributes.picture.data.attributes.formats?.small?.url || attributes.picture.data.attributes.url,
                thumbnail: attributes.picture.data.attributes.formats?.thumbnail?.url || attributes.picture.data.attributes.url,
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
  