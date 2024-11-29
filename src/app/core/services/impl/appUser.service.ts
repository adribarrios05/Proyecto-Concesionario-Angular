// src/app/services/impl/people.service.ts
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { map, Observable } from 'rxjs';
import { Car } from '../../models/car.model';
import { ICarService } from '../interfaces/car-service.interface';
import { ICarRepository } from '../../repositories/intefaces/car-repository.interface';
import { APPUSER_REPOSITORY_TOKEN, CAR_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { IAppUserService } from '../interfaces/appUser-service.interface';
import { AppUser } from '../../models/appUser.model';
import { IAppUserRepository } from '../../repositories/intefaces/appUser-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class AppUserService extends BaseService<AppUser> implements IAppUserService {
  constructor(
    @Inject(APPUSER_REPOSITORY_TOKEN) repository: IAppUserRepository
  ) {
    super(repository);
  }
  
  // Implementa métodos específicos si los hay
  getByUserId(userId: string): Observable<AppUser | null> {
    return this.repository.getAll(1, 1, {user: userId}).pipe(
      map(res => Array.isArray(res) ? res[0] || null : res.data[0] || null)
    );
  }

  
}
