import { DocumentReference } from "firebase/firestore";

export interface FirebaseCar {
    brand: string,
    model: string,
    price: number,
    doors: number,
    description: string,
    horsePower: number,
    color: string,
    type: string,
    plate: string,
    customerId?: DocumentReference;
    picture?: string;
} 