import { Car } from "../../models/car.model";
import { IBaseService } from "./base-service.interface";

/**
 * Servicio especializado en la gestión de coches.
 * Hereda operaciones genéricas desde `IBaseService`.
 */
export interface ICarService extends IBaseService<Car> {
  // Puedes añadir métodos específicos aquí si son necesarios.
}
