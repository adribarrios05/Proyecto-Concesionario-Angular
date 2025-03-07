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
    customer?: DocumentReference | null;
    picture?: string;
} 