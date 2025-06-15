import { DocumentReference } from "firebase/firestore";

// Modelo específico para Firestore: cliente
export interface FirebaseCustomer {
    name: string,
    surname: string,
    dni: string,
    phone: string,
    birthDate: Date,
    user: DocumentReference;
    picture?: string;
    username: string;
    role: string[];
}
