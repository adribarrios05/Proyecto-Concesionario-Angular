import { Observable } from "rxjs";
import { Car } from "../../models/car.model";
import { IBaseRepository } from "./base-repository.interface";
import { Customer } from "../../models/customer.model";

export interface ICarRepository extends IBaseRepository<Car>{
    getCustomerRentCar(carId: number): Observable<Customer>
}