import { Customer } from "../../models/customer.model";
import { IBaseService } from "./base-service.interface";

/**
 * Servicio especializado en la gestión de clientes.
 * Hereda métodos genéricos desde `IBaseService`.
 */
export interface ICustomerService extends IBaseService<Customer> {
  // Aquí se pueden definir métodos específicos para clientes si son necesarios.
}
