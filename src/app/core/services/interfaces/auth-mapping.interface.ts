import { User } from "firebase/auth";
import { SignInPayload, SignUpPayload } from "../../models/auth.model";

/**
 * Interfaz que define el mapeo entre los datos de autenticación del backend y el modelo interno de la app.
 */
export interface IAuthMapping {
  /**
   * Transforma el payload de inicio de sesión a un formato compatible con el backend.
   * @param payload Datos del formulario de inicio de sesión.
   */
  signInPayload(payload: SignInPayload): any;

  /**
   * Transforma el payload de registro a un formato compatible con el backend.
   * @param payload Datos del formulario de registro.
   */
  signUpPayload(payload: SignUpPayload): any;

  /**
   * Transforma la respuesta de inicio de sesión del backend al modelo interno `User`.
   * @param response Respuesta del backend al iniciar sesión.
   */
  signIn(response: any): any;

  /**
   * Transforma la respuesta de registro del backend al modelo interno `User`.
   * @param response Respuesta del backend al registrarse.
   */
  signUp(response: any): any;

  /**
   * Transforma la respuesta del endpoint `/me` del backend al modelo interno `User`.
   * @param response Respuesta del backend con información del usuario autenticado.
   */
  me(response: any): any;
}
