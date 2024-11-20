import { Model } from "./base.model";

export interface AppUser extends Model{
    email: String,
    password: String,
    username: String,
    customerId: String
}