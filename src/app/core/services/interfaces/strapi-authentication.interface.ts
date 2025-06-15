import { IAuthentication } from "./authentication.interface";

/**
 * Extiende el sistema de autenticación base para incluir token JWT de Strapi.
 */
export interface IStrapiAuthentication extends IAuthentication {
  /**
   * Devuelve el token JWT actual, si existe.
   */
  getToken(): string | null;
}
