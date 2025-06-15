import { Injectable } from "@angular/core";
import { IAuthMapping } from "../interfaces/auth-mapping.interface";
import { SignInPayload, SignUpPayload, User } from "../../models/auth.model";
import { User as FirebaseUser } from 'firebase/auth';

/**
 * Servicio de mapeo entre los datos de autenticación internos y el formato usado por Firebase.
 * Convierte las respuestas y solicitudes de login/signup para integrarlas con la app.
 *
 * @export
 * @class FirebaseAuthMappingService
 * @implements {IAuthMapping}
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthMappingService implements IAuthMapping {

  /**
   * Mapea el payload de inicio de sesión al formato requerido por Firebase.
   *
   * @param payload Datos del formulario de login
   * @returns Objeto con `email` y `password`
   */
  signInPayload(payload: SignInPayload): { email: string, password: string } {
    return {
      email: payload.email,
      password: payload.password
    };
  }

  /**
   * Mapea el payload de registro al formato requerido por Firebase.
   *
   * @param payload Datos del formulario de registro
   * @returns Objeto con `email` y `password`
   */
  signUpPayload(payload: SignUpPayload): { email: string, password: string } {
    return {
      email: payload.email,
      password: payload.password
      // No se utiliza username porque Firebase no lo gestiona directamente
    };
  }

  /**
   * Transforma el usuario de Firebase al modelo interno `User` tras iniciar sesión.
   *
   * @param response Objeto `FirebaseUser` retornado por Firebase
   * @returns Objeto `User` interno
   */
  signIn(response: FirebaseUser): User {
    console.log("Response del mapping", response);
    return {
      id: response.uid,
      username: response.displayName || response.email || '',
      email: response.email || ''
    };
  }

  /**
   * Transforma el usuario de Firebase al modelo interno `User` tras registrarse.
   *
   * @param response Objeto `FirebaseUser` retornado por Firebase
   * @returns Objeto `User` interno
   */
  signUp(response: FirebaseUser): User {
    return {
      id: response.uid,
      username: response.displayName || response.email || '',
      email: response.email || ''
    };
  }

  /**
   * Obtiene los datos del usuario autenticado actual desde Firebase.
   *
   * @param response Objeto `FirebaseUser` retornado por Firebase
   * @returns Objeto `User` interno
   */
  me(response: FirebaseUser): User {
    return {
      id: response.uid,
      username: response.displayName || response.email || '',
      email: response.email || ''
    };
  }
}
