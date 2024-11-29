import { Observable } from 'rxjs';
import { IBaseService } from './base-service.interface';
import { Car } from '../../models/car.model';
import { AppUser } from '../../models/appUser.model';

export interface IAppUserService extends IBaseService<AppUser> {
  // Métodos específicos si los hay
  getByUserId(userId: string): Observable<AppUser | null>;
}
