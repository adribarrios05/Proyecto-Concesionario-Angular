import { Observable } from 'rxjs';
import { IBaseService } from './base-service.interface';
import { Car } from '../../models/car.model';

export interface ICarService extends IBaseService<Car> {
  // Métodos específicos si los hay
  getByUserId(userId: string): Observable<Car | null>;
}
