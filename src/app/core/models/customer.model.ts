import { Model } from "./base.model";

export interface Customer extends Model{
    name: string,
    surname: string,
    dni: string,
    phone: string,
    birthDate: Date,
    //carRent?: number,
    userId?: number | string,
    picture?:{
        url:string | undefined,
        large:string | undefined,
        medium:string | undefined,
        small:string | undefined,
        thumbnail:string | undefined
    },
    username?: string
}