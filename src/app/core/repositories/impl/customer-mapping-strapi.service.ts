import { Injectable } from "@angular/core";
import { Customer } from "../../models/customer.model";
import { Paginated } from "../../models/paginated.model";
import { StrapiMedia } from "../../services/impl/strapi-media.service";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { map } from "rxjs";

/**
 * Representación cruda del campo `picture` en Strapi.
 */
interface MediaRaw {
    data: StrapiMedia;
}

/**
 * Representación cruda del usuario relacionado con el cliente.
 */
interface UserRaw {
    data: UserData;
}

/**
 * Información básica del usuario relacionada con el cliente.
 */
interface UserData {
    id: number;
    attributes: UserAttributes;
}

/**
 * Atributos del usuario relacionados con el cliente.
 */
interface UserAttributes {
    username: string;
    email: string;
    imageUrl: string;
    customerId: string;
}

/**
 * Estructura devuelta por Strapi para un cliente individual.
 */
export interface CustomerRaw {
    data: Data;
    meta: Meta;
}

/**
 * Datos individuales de un cliente.
 */
interface Data {
    id: number;
    attributes: CustomerAttributes;
}

/**
 * Datos preparados para enviar un cliente a Strapi.
 */
interface CustomerData {
    data: CustomerAttributes;
}

/**
 * Atributos de un cliente tal como los espera o devuelve Strapi.
 */
interface CustomerAttributes {
    name: string;
    surname: string;
    dni: string;
    phone: string;
    birthDate: Date;
    userId: UserRaw | number | null;
    picture: MediaRaw | number | null;
    role: string[];
}

/**
 * Estructura cruda de un coche relacionado.
 */
interface CarRaw {
    data: CarData;
    meta: Meta;
}

/**
 * Estructura del objeto coche relacionado con el cliente.
 */
interface CarData {
    id: number;
    attributes: CarAttributes;
}

/**
 * Información de un coche almacenada en Strapi.
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
 * Estructura de metadatos devuelta por Strapi.
 */
interface Meta {}

/**
 * Servicio de mapeo para transformar datos entre `Customer` y el formato usado en Strapi.
 *
 * @export
 * @class CustomerMappingStrapi
 * @implements {IBaseMapping<Customer>}
 */
@Injectable({
    providedIn: 'root'
})
export class CustomerMappingStrapi implements IBaseMapping<Customer> {

    /**
     * Convierte un objeto `Customer` al formato requerido por Strapi para creación.
     *
     * @param data Objeto de tipo Customer
     * @returns Objeto transformado listo para el POST en Strapi
     */
    setAdd(data: any): any {
        const formatToISODate = (date: string): string => {
            const [day, month, year] = date.split('-').map(num => Number(num));
            return new Date(year, month - 1, day).toISOString();
        };

        console.log('Datos recibidos en setAdd:', data);

        const miCustomer = {
            data: {
                name: data.name,
                surname: data.surname,
                dni: data.dni,
                phone: data.phone,
                birthDate: data.birthDate,
                user: data.userId ? Number(data.userId) : null,
                picture: data.picture ? Number(data.picture) : null,
                role: data.role && data.role.length > 0 ? data.role : ['cliente']
            }
        };

        console.log("Pongo un texto cualquiera: ", miCustomer);
        return miCustomer;
    }

    /**
     * Convierte datos parciales de `Customer` al formato que Strapi espera para actualización.
     *
     * @param data Datos parciales de Customer
     * @returns Objeto parcial transformado
     */
    setUpdate(data: Partial<Customer>): CustomerData {
        const mappedData: Partial<CustomerAttributes> = {};

        Object.keys(data).forEach(key => {
            switch (key) {
                case 'name': mappedData.name = data[key]; break;
                case 'surname': mappedData.surname = data[key]; break;
                case 'dni': mappedData.dni = data[key]; break;
                case 'phone': mappedData.phone = data[key]; break;
                case 'birthDate': mappedData.birthDate = data[key]; break;
                case 'user': mappedData.userId = data[key] ? Number(data[key]) : null; break;
                case 'picture': mappedData.picture = data[key] ? Number(data[key]) : null; break;
                case 'role':
                    const roleArray = Array.isArray(data[key]) ? data[key] : undefined;
                    mappedData.role = roleArray && roleArray.length > 0 ? roleArray : ['customer'];
                    break;
            }
        });

        return {
            data: mappedData as CustomerAttributes
        };
    }

    /**
     * Convierte una lista paginada de objetos de Strapi a una lista de objetos `Customer`.
     *
     * @param page Página actual
     * @param pageSize Tamaño de página
     * @param pages Total de páginas
     * @param data Lista cruda de objetos
     * @returns Paginado de objetos Customer
     */
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

    /**
     * Transforma un objeto `Data` o `CustomerRaw` devuelto por Strapi en un objeto `Customer`.
     *
     * @param data Objeto recibido desde Strapi
     * @returns Objeto Customer
     */
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
            birthDate: attributes?.birthDate || 0,
            user: attributes?.userId?.data?.id || undefined,
            picture: attributes?.picture?.data ? {
                url: attributes.picture.data.attributes.url,
                large: attributes.picture.data.attributes.formats?.large?.url || attributes.picture.data.attributes.url,
                medium: attributes.picture.data.attributes.formats?.medium?.url || attributes.picture.data.attributes.url,
                small: attributes.picture.data.attributes.formats?.small?.url || attributes.picture.data.attributes.url,
                thumbnail: attributes.picture.data.attributes.formats?.thumbnail?.url || attributes.picture.data.attributes.url,
            } : undefined,
            role: attributes?.role
        };
    }

    /**
     * Devuelve el objeto `Customer` resultante después de una operación de creación en Strapi.
     *
     * @param data Objeto devuelto por Strapi tras el POST
     * @returns Objeto Customer transformado
     */
    getAdded(data: CustomerRaw): Customer {
        return this.getOne(data.data);
    }

    /**
     * Devuelve el objeto `Customer` resultante después de una operación de actualización en Strapi.
     *
     * @param data Objeto devuelto por Strapi tras el PUT
     * @returns Objeto Customer transformado
     */
    getUpdated(data: CustomerRaw): Customer {
        return this.getOne(data.data);
    }

    /**
     * Devuelve el objeto `Customer` resultante después de una operación de eliminación en Strapi.
     *
     * @param data Objeto devuelto por Strapi tras el DELETE
     * @returns Objeto Customer transformado
     */
    getDeleted(data: CustomerRaw): Customer {
        return this.getOne(data.data);
    }
}
