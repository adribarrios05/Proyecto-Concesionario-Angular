import { Observable } from "rxjs";

/**
 * Interfaz genérica para servicios de autenticación.
 */
export interface IAuthentication {
  /**
   * Realiza la solicitud de inicio de sesión.
   * @param authPayload Datos de acceso del usuario.
   */
  signIn(authPayload: any): Observable<any>;

  /**
   * Registra un nuevo usuario.
   * @param registerPayload Datos del nuevo usuario.
   */
  signUp(registerPayload: any): Observable<any>;

  /**
   * Cierra sesión y limpia la sesión local.
   */
  signOut(): Observable<any>;

  /**
   * Recupera la información del usuario autenticado.
   */
  me(): Observable<any>;

  /**
   * Devuelve el usuario actual si está autenticado.
   */
  getCurrentUser(): Promise<any>;
}
