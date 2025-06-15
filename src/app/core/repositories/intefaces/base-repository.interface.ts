import { Observable } from 'rxjs';
import { Model } from '../../models/base.model';
import { Paginated } from '../../models/paginated.model';

/**
 * Interfaz de los parámetros de búsqueda aplicables en la obtención paginada.
 *
 * @export
 * @interface SearchParams
 */
export interface SearchParams {
  [key: string]: string | number | { $gte?: number; $lte?: number } | { $in?: string[] };
}

/**
 * Interfaz genérica para repositorios de entidades que extienden de `Model`.
 * Define operaciones CRUD y paginación.
 *
 * @export
 * @interface IBaseRepository
 * @template T Modelo que extiende de `Model`
 */
export interface IBaseRepository<T extends Model> {
  /**
   * Obtiene todos los registros paginados aplicando filtros.
   * @param page Página actual
   * @param pageSize Tamaño de la página
   * @param filters Filtros personalizados
   * @param orderField Campo por el cual se ordenan los resultados
   */
  getAll(page: number, pageSize: number, filters: SearchParams, orderField: string): Observable<T[] | Paginated<T>>;

  /**
   * Obtiene un registro por su identificador.
   * @param id Identificador único
   */
  getById(id: string): Observable<T | null>;

  /**
   * Añade un nuevo registro.
   * @param entity Objeto de tipo T
   */
  add(entity: T): Observable<T>;

  /**
   * Actualiza un registro existente.
   * @param id Identificador del objeto
   * @param entity Objeto con datos actualizados
   */
  update(id: string, entity: T): Observable<T>;

  /**
   * Elimina un registro.
   * @param id Identificador del objeto a eliminar
   */
  delete(id: string): Observable<T>;

  /**
   * (Opcional) Sube una imagen relacionada con la entidad.
   * @param file Archivo de imagen
   */
  uploadImage?(file: File): Observable<any>;
}
