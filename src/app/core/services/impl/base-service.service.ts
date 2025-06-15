// src/app/services/impl/base-service.service.ts
import { Injectable, Inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { IBaseService } from '../interfaces/base-service.interface';
import { IBaseRepository, SearchParams } from '../../repositories/intefaces/base-repository.interface';
import { Model } from '../../models/base.model';
import { Paginated } from '../../models/paginated.model';
import { REPOSITORY_TOKEN } from '../../repositories/repository.tokens';

/**
 * Servicio genérico base para entidades del dominio.
 * Implementa operaciones CRUD conectadas a un repositorio inyectado.
 *
 * @export
 * @class BaseService
 * @template T Modelo que extiende de `Model`
 */
@Injectable({
  providedIn: 'root'
})
export class BaseService<T extends Model> implements IBaseService<T> {

  /**
   * Constructor que inyecta el repositorio genérico correspondiente a la entidad.
   *
   * @param repository Repositorio inyectado para la entidad
   */
  constructor(
    @Inject(REPOSITORY_TOKEN) protected repository: IBaseRepository<T>
  ) {}

  /**
   * Sobrecarga de métodos para obtener todos los registros.
   */
  getAll(): Observable<T[]>;
  getAll(page: number, pageSize: number): Observable<Paginated<T>>;
  getAll(page: number, pageSize: number, filters: SearchParams): Observable<Paginated<T>>;
  getAll(page: number, pageSize: number, filters: SearchParams, orderField: string): Observable<Paginated<T>>;

  /**
   * Obtiene todos los registros aplicando paginación, filtros y ordenación.
   *
   * @param page Página actual (opcional)
   * @param pageSize Tamaño de página (opcional)
   * @param filters Filtros de búsqueda (opcional)
   * @param orderField Campo para ordenar los resultados (opcional)
   */
  getAll(
    page?: number,
    pageSize?: number,
    filters?: SearchParams,
    orderField?: string
  ): Observable<T[] | Paginated<T>> {
    if (page === undefined || pageSize === undefined)
      return this.repository.getAll(1, 25, {}, 'id');
    else {
      return this.repository
        .getAll(page, pageSize, filters ?? {}, orderField || 'id')
        .pipe(tap((response) => console.log('📦 Datos recibidos en el servicio base:', response)));
    }
  }

  /**
   * Obtiene un objeto por su ID.
   *
   * @param id Identificador único del objeto
   */
  getById(id: string): Observable<T | null> {
    return this.repository.getById(id);
  }

  /**
   * Añade un nuevo objeto.
   *
   * @param entity Entidad a crear
   */
  add(entity: T): Observable<T> {
    console.log("Objeto que llega al servicio: ", entity);
    return this.repository.add(entity);
  }

  /**
   * Actualiza un objeto existente.
   *
   * @param id ID del objeto
   * @param entity Entidad actualizada
   */
  update(id: string, entity: T): Observable<T> {
    return this.repository.update(id, entity);
  }

  /**
   * Elimina un objeto por ID.
   *
   * @param id ID del objeto a eliminar
   */
  delete(id: string): Observable<T> {
    return this.repository.delete(id);
  }
}
