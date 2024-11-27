import { Observable } from "rxjs";
import { Car } from "../../models/car.model";
import { IBaseService } from "./base-service.interface";

export interface ICarService extends IBaseService<Car>{
    getByOwner(customerId: string): Observable< Car | null>
}