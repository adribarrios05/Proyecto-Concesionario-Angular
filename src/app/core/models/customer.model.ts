import { Model } from "./base.model";

export interface Customer extends Model{
    name: string,
    surname: string,
    DNI: string,
    phone: string,
    age: string,
    gender: string,
    carRent?: number,
    userId?: number,
    picture?:{
        url:string | undefined,
        large:string | undefined,
        medium:string | undefined,
        small:string | undefined,
        thumbnail:string | undefined
    },
}