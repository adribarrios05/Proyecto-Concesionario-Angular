import { Observable } from "rxjs";
import { Car } from "../../models/car.model";
import { IBaseRepository } from "./base-repository.interface";

/**
 * Interfaz específica para el repositorio de coches.
 * Extiende de la interfaz genérica `IBaseRepository`.
 *
 * @export
 * @interface ICarRepository
 */
export interface ICarRepository extends IBaseRepository<Car> {
  // Aquí se pueden añadir métodos específicos si se necesitan
}
