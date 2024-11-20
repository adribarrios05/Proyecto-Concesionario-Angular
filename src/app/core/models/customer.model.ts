import { Model } from "./base.model";

export interface Customer extends Model{
    name: String,
    surname: String,
    DNI: String,
    phone: String,
    age: String,
    carRentId?: Number,
    userId?: Number
}