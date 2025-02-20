// src/app/core/repositories/interfaces/people-repository.interface.ts
import { Observable } from "rxjs";
import { Car } from "./src/app/core/models/car.model";
import { IBaseRepository } from "./src/app/core/repositories/intefaces/base-repository.interface";

export interface ICarRepository extends IBaseRepository<Car>{

}