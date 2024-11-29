// src/app/core/repositories/interfaces/people-repository.interface.ts

import { AppUser } from "../../models/appUser.model";
import { IBaseRepository } from "./base-repository.interface";

export interface IAppUserRepository extends IBaseRepository<AppUser>{

}