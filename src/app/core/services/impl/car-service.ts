import { Inject, Injectable } from "@angular/core";
import { Car } from "../../models/car.model";
import { BaseService } from "./base-service";
import { ICarService } from "../interfaces/car-service.interface";
import { Observable, map } from "rxjs";
import { CAR_REPOSITORY_TOKEN } from "../../repositories/repository.tokens";
import { ICarRepository } from "../../repositories/interfaces/car-repository.interface";


@Injectable({
    providedIn: 'root'
})

export class CarService extends BaseService<Car> implements ICarService{
    constructor(
        @Inject(CAR_REPOSITORY_TOKEN) repository: ICarRepository
    ) {
        super(repository)
    }
 

    getByOwner(customerId: string): Observable<Car | null> {
        return this.repository.getAll(1, 1, {customer: customerId}).pipe(
            map(res => Array.isArray(res) ? res[0] || null : res.data[0] || null)
        )
    }
}