import { DocumentReference } from "firebase/firestore";
import { Model } from "./base.model";

// Modelo para representar un coche completo en la app
export interface Car extends Model {
    brand: string,
    model: string,
    price: number,
    doors: number,
    description: string,
    horsePower: number,
    color: string,
    type: string,
    plate: string,
    customer?: number | string | DocumentReference,
    picture?: {
        url: string | undefined,
        large: string | undefined,
        medium: string | undefined,
        small: string | undefined,
        thumbnail: string | undefined
    },
}
