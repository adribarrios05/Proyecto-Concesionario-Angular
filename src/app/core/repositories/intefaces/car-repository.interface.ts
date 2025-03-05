// src/app/core/repositories/interfaces/people-repository.interface.ts
import { Observable } from "rxjs";
import { Car } from "../../models/car.model";
import { IBaseRepository } from "./base-repository.interface";

export interface ICarRepository extends IBaseRepository<Car>{

}