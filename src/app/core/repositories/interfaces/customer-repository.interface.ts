import { Observable } from "rxjs";
import { Customer } from "../../models/customer.model";
import { IBaseRepository } from "./base-repository.interface";
import { Car } from "../../models/car.model";
import { AppUser } from "../../models/appUser.model";

export interface ICustomerRepository extends IBaseRepository<Customer>{
    getCarsOfCustomer(id: string): Observable<Array<Car>>
    getUser(id: string): Observable<AppUser>
}