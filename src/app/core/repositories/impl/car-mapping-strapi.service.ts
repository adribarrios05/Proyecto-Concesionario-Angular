import { Injectable } from "@angular/core";
import { Car } from "../../models/car.model";
import { Paginated } from "../../models/paginated.model";
import { StrapiMedia } from "../../services/impl/strapi-media.service";
import { IBaseMapping } from "../intefaces/base-mapping.interface";

/**
 * Representación cruda del campo `picture` devuelto por Strapi.
 */
interface MediaRaw {
    data: StrapiMedia;
}

/**
 * Representación cruda de un usuario relacionado desde Strapi.
 */
interface UserRaw {
    data: UserData;
}

/**
 * Información de usuario relacionada desde Strapi.
 */
interface UserData {
    id: number;
    attributes: UserAttributes;
}

/**
 * Atributos del usuario relacionados con un cliente.
 */
interface UserAttributes {
    username: string;
    email: string;
    imageUrl: string;
    customerId: string;
}

/**
 * Objeto completo devuelto por Strapi al trabajar con un solo coche.
 */
interface CarRaw {
    data: Data;
    meta: Meta;
}

/**
 * Representación del objeto principal en Strapi.
 */
interface Data {
    id: number;
    attributes: CarAttributes;
}

/**
 * Estructura de envío esperada por Strapi para crear/actualizar un coche.
 */
interface CarData {
    data: CarAttributes;
}

/**
 * Atributos de un coche en Strapi.
 */
interface CarAttributes {
    brand: string;
    model: string;
    horsePower: number;
    doors: number;
    description: string;
    color: string;
    type: string;
    price: number;
    plate: string;
    customer: CustomerRaw | number | null;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    picture: MediaRaw | number | null;
}

/**
 * Objeto que representa el cliente relacionado con un coche.
 */
interface CustomerRaw {
    data: CustomerData;
    meta: Meta;
}

/**
 * Información del cliente contenida en un objeto `CustomerRaw`.
 */
interface CustomerData {
    id: number;
    attributes: CustomerAttributes;
}

/**
 * Datos personales del cliente relacionados con un coche.
 */
interface CustomerAttributes {
    name: string;
    surname: string;
    DNI: string;
    phone: string;
    birthDate: Date;
    gender: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    carRent: CarRaw | number | null;
    appUser: UserRaw | number | null;
    picture: MediaRaw | number | null;
}

/**
 * Objeto de metainformación devuelto por Strapi.
 */
interface Meta {}

/**
 * Servicio de mapeo para el modelo `Car` al formato esperado por la API de Strapi.
 * Permite convertir entre la estructura interna del modelo y la estructura externa usada por el backend.
 *
 * @export
 * @class CarMappingStrapi
 * @implements {IBaseMapping<Car>}
 */
@Injectable({
    providedIn: 'root'
})
export class CarMappingStrapi implements IBaseMapping<Car> {
    
    /**
     * Convierte un objeto `Car` al formato que acepta la API de Strapi para la creación.
     *
     * @param data Objeto Car a mapear
     * @returns Objeto en formato CarData
     */
    setAdd(data: Car) {
        return {
            data: {
                brand: data.brand,
                model: data.model,
                horsePower: data.horsePower,
                doors: data.doors,
                description: data.description,
                color: data.color,
                type: data.type,
                price: data.price,
                plate: data.plate,
                customer: { id: data.customer },
                picture: data.picture ? Number(data.picture) : null
            }
        };
    }

    /**
     * Convierte parcialmente un objeto `Car` al formato de actualización que acepta Strapi.
     *
     * @param data Datos parciales de Car
     * @returns Objeto parcial en formato CarData
     */
    setUpdate(data: Partial<Car>): CarData {
        const mappedData: Partial<CarAttributes> = {};

        Object.keys(data).forEach(key => {
            switch (key) {
                case 'brand': mappedData.brand = data[key]; break;
                case 'model': mappedData.model = data[key]; break;
                case 'horsePower': mappedData.horsePower = data[key]; break;
                case 'doors': mappedData.doors = data[key]; break;
                case 'description': mappedData.description = data[key]; break;
                case 'color': mappedData.color = data[key]; break;
                case 'type': mappedData.type = data[key]; break;
                case 'price': mappedData.price = data[key]; break;
                case 'plate': mappedData.plate = data[key]; break;
                case 'customer': mappedData.customer = data[key] ? Number(data[key]) : null; break;
                case 'picture': mappedData.picture = data[key] ? Number(data[key]) : null; break;
            }
        });

        return {
            data: mappedData as CarAttributes
        };
    }

    /**
     * Convierte una lista de datos devueltos por Strapi a un objeto paginado de tipo `Car`.
     *
     * @param page Página actual
     * @param pageSize Tamaño de página
     * @param pages Total de páginas
     * @param data Datos crudos de Strapi
     * @returns Objeto paginado de tipo `Car`
     */
    getPaginated(page: number, pageSize: number, pages: number, data: Data[]): Paginated<Car> {
        return {
            page: page,
            pageSize: pageSize,
            pages: pages,
            data: data.map<Car>((d: Data | CarRaw) => {
                return this.getOne(d);
            })
        };
    }

    /**
     * Convierte un objeto de tipo `Data` o `CarRaw` en un objeto de tipo `Car`.
     *
     * @param data Objeto proveniente de Strapi
     * @returns Objeto Car
     */
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

    /**
     * Devuelve el objeto `Car` obtenido tras añadir un coche en Strapi.
     *
     * @param data Resultado del POST en Strapi
     * @returns Objeto Car
     */
    getAdded(data: CarRaw): Car {
        return this.getOne(data.data);
    }

    /**
     * Devuelve el objeto `Car` obtenido tras actualizar un coche en Strapi.
     *
     * @param data Resultado del PUT en Strapi
     * @returns Objeto Car
     */
    getUpdated(data: CarRaw): Car {
        return this.getOne(data.data);
    }

    /**
     * Devuelve el objeto `Car` obtenido tras eliminar un coche en Strapi.
     *
     * @param data Resultado del DELETE en Strapi
     * @returns Objeto Car
     */
    getDeleted(data: CarRaw): Car {
        return this.getOne(data.data);
    }
}
