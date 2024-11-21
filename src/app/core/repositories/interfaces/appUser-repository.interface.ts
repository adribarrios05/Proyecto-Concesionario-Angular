import { Observable } from "rxjs";
import { Car } from "../../models/car.model";
import { IBaseRepository } from "./base-repository.interface";
import { Customer } from "../../models/customer.model";
import { AppUser } from "../../models/appUser.model";

export interface IAppUserRepository extends IBaseRepository<AppUser>{
    getCustomerFromUser(id: number): Observable<Customer>
}