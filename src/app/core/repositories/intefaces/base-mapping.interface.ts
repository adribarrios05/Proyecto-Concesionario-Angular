import { Observable } from 'rxjs';
import { Model } from '../../models/base.model';
import { Paginated } from '../../models/paginated.model';

/**
 * Interfaz para el servicio de mapeo entre datos crudos y el modelo de dominio `T`.
 * Define los métodos que deben implementarse para transformar datos de entrada y salida.
 *
 * @export
 * @interface IBaseMapping
 * @template T Modelo de datos principal
 */
export interface IBaseMapping<T> {
  /**
   * Transforma un conjunto de datos crudos en un objeto paginado.
   * @param page Página actual
   * @param pageSize Tamaño de la página
   * @param pages Total de páginas
   * @param data Datos crudos
   */
  getPaginated(page: number, pageSize: number, pages: number, data: any): Paginated<T>;

  /**
   * Transforma un objeto crudo en un objeto del modelo `T`.
   * @param data Datos de entrada
   */
  getOne(data: any): T;

  /**
   * Transforma el resultado de una creación en un objeto `T`.
   * @param data Datos del objeto creado
   */
  getAdded(data: any): T;

  /**
   * Transforma el resultado de una actualización en un objeto `T`.
   * @param data Datos del objeto actualizado
   */
  getUpdated(data: any): T;

  /**
   * Transforma el resultado de una eliminación en un objeto `T`.
   * @param data Datos del objeto eliminado
   */
  getDeleted(data: any): T;

  /**
   * Prepara un objeto `T` para ser enviado como nuevo.
   * @param data Objeto del dominio
   */
  setAdd(data: T): any;

  /**
   * Prepara los datos para una actualización parcial.
   * @param data Objeto parcial a actualizar
   */
  setUpdate(data: any): any;
}
