import { Observable } from 'rxjs';
import { Model } from '../../models/base.model';

export interface IBaseRepository<T extends Model> {
  getAll(page:number, pageSize:number): Observable< T[]>;
  getById(id: string): Observable<T | null>;
  add(entity: T): Observable<T>;
  update(id: string, entity: T): Observable<T>;
  delete(id: string): Observable<T>;
}