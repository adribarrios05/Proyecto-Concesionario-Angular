import { Model } from "./base.model";

export interface Car extends Model{
    brand: String,
    model: String,
    price: Number,
    doors: Number,
    description: String,
    horsePower: Number,
    color: String,
    type: String,
    customerId?: Number
}