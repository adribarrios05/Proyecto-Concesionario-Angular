import { Observable } from "rxjs";
import { Customer } from "../../models/customer.model";
import { IBaseRepository } from "./base-repository.interface";

/**
 * Interfaz específica para el repositorio de clientes.
 * Extiende de `IBaseRepository` y añade métodos relacionados con usuarios.
 *
 * @export
 * @interface ICustomerRepository
 */
export interface ICustomerRepository extends IBaseRepository<Customer> {
  /**
   * Obtiene un cliente y sus datos de usuario asociado.
   * @param customerId ID del cliente
   */
  getCustomerWithUser(customerId: number): Observable<Customer>;

  /**
   * Obtiene un cliente a partir del ID del usuario.
   * @param userId ID del usuario
   */
  getByUserId(userId: number | string): Observable<Customer | null>;
}
