import { Injectable } from "@angular/core";
import { Paginated } from "../../models/paginated.model";
import { IAuthMapping } from "../interfaces/auth-mapping.interface";
import { SignInPayload, SignUpPayload, User } from "../../models/auth.model";


/**
 * Interfaces de respuesta de Strapi para autenticación.
 */
export interface StrapiMeResponse {
    id: number
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
}

export interface StrapiSignInResponse {
    jwt: string
    user: StrapiUser
  }

export interface StrapiSignUpResponse {
    jwt: string
    user: StrapiUser
  }
  
  export interface StrapiUser {
    id: number
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
  }
  

interface StrapiSignIn{
    identifier:string,
    password:string
}

interface StrapiSignUp{
    email:string,
    password:string,
    username:string
}
export interface GroupRaw {
    id: string
    nombre: string
}

/**
 * Servicio para mapear datos entre Strapi y el modelo de autenticación local.
 *
 * @export
 * @class StrapiAuthMappingService
 * @implements {IAuthMapping}
 */
@Injectable({
  providedIn: 'root'
})
export class StrapiAuthMappingService implements IAuthMapping {

  /**
   * Mapea los datos del login al formato que espera Strapi.
   *
   * @param payload Credenciales introducidas por el usuario
   * @returns Objeto con `identifier` y `password`
   */
  signInPayload(payload: SignInPayload): StrapiSignIn {
    return {
      identifier: payload.email,
      password: payload.password
    };
  }

  /**
   * Mapea los datos de registro al formato de Strapi.
   *
   * @param payload Datos del nuevo usuario
   * @returns Objeto con `email`, `password` y `username`
   */
  signUpPayload(payload: SignUpPayload): StrapiSignUp {
    return {
      email: payload.email,
      password: payload.password,
      username: payload.username
    };
  }

  /**
   * Transforma la respuesta de login de Strapi al modelo `User`.
   *
   * @param response Respuesta de Strapi al iniciar sesión
   */
  signIn(response: StrapiSignInResponse): User {
    return {
      id: response.user.id.toString(),
      username: response.user.username,
      email: response.user.email
    };
  }

  /**
   * Transforma la respuesta de registro de Strapi al modelo `User`.
   *
   * @param response Respuesta de Strapi tras registrarse
   */
  signUp(response: StrapiSignUpResponse): User {
    return {
      id: response.user.id.toString(),
      username: response.user.username,
      email: response.user.email
    };
  }

  /**
   * Transforma la respuesta de `/me` de Strapi al modelo `User`.
   *
   * @param response Objeto con datos del usuario autenticado
   */
  me(response: StrapiMeResponse): User {
    return {
      id: response.id.toString(),
      username: response.username,
      email: response.email
    };
  }
}