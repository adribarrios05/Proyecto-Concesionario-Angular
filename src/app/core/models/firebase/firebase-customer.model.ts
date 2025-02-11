import { DocumentReference } from "firebase/firestore";

export interface FirebaseCustomer {
    name: string,
    surname: string,
    dni: string,
    phone: string,
    birthDate: Date,
    user?: string;
    customerId?: DocumentReference;
    picture?: string;
} 