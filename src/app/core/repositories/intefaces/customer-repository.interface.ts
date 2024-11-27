// src/app/core/repositories/interfaces/people-repository.interface.ts

import { Customer } from "../../models/customer.model";
import { IBaseRepository } from "./base-repository.interface";

export interface ICustomerRepository extends IBaseRepository<Customer>{

}