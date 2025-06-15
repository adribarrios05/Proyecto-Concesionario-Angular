import { User } from "./auth.model";
import { Model } from "./base.model";

// Modelo completo de cliente en la app
export interface Customer extends Model {
    name: string,
    surname: string,
    dni: string,
    phone: string,
    birthDate: Date,
    user: User,
    picture?: string | {
        url?: string | undefined,
        large?: string | undefined,
        medium?: string | undefined,
        small?: string | undefined,
        thumbnail?: string | undefined
    },
    username?: string,
    role: string[];
}
