import { Observable } from "rxjs";
import { Paginated } from "../../models/paginated.model";
import { SearchParams } from "../../repositories/intefaces/base-repository.interface";

/**
 * Interfaz base para servicios que gestionan entidades genéricas.
 */
export interface IBaseService<T> {
  /**
   * Devuelve todos los elementos sin paginación.
   */
  getAll(): Observable<T[]>;

  /**
   * Devuelve una página de elementos.
   * @param page Número de página.
   * @param pageSize Elementos por página.
   */
  getAll(page: number, pageSize: number): Observable<Paginated<T>>;

  /**
   * Devuelve elementos paginados y/o filtrados según parámetros.
   * @param page Número de página.
   * @param pageSize Elementos por página.
   * @param filters Filtros de búsqueda.
   */
  getAll(page: number, pageSize: number, filters: SearchParams): Observable<T[] | Paginated<T>>;

  /**
   * Obtiene un elemento por su ID.
   * @param id ID del elemento.
   */
  getById(id: string): Observable<T | null>;

  /**
   * Añade un nuevo elemento.
   * @param entity Objeto a guardar.
   */
  add(entity: T): Observable<T>;

  /**
   * Actualiza un elemento por su ID.
   * @param id ID del elemento.
   * @param entity Objeto actualizado.
   */
  update(id: string, entity: T): Observable<T>;

  /**
   * Elimina un elemento por su ID.
   * @param id ID del elemento.
   */
  delete(id: string): Observable<T>;
}
