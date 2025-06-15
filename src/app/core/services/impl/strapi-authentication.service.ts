import { Inject, Injectable } from '@angular/core';
import { filter, firstValueFrom, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { BaseAuthenticationService } from './base-authentication.service';
import {
  AUTH_MAPPING_TOKEN,
  AUTH_ME_API_URL_TOKEN,
  AUTH_SIGN_IN_API_URL_TOKEN,
  AUTH_SIGN_UP_API_URL_TOKEN
} from '../../repositories/repository.tokens';
import { HttpClient } from '@angular/common/http';
import { IAuthMapping } from '../interfaces/auth-mapping.interface';
import {
  StrapiMeResponse,
  StrapiSignInResponse,
  StrapiSignUpResponse
} from './strapi-auth-mapping.service';
import { IStrapiAuthentication } from '../interfaces/strapi-authentication.interface';
import { User } from '../../models/auth.model';

/**
 * Servicio de autenticación que utiliza Strapi como backend.
 * Maneja login, registro, obtención de usuario y token JWT.
 *
 * @export
 * @class StrapiAuthenticationService
 * @extends {BaseAuthenticationService}
 * @implements {IStrapiAuthentication}
 */
@Injectable({
  providedIn: 'root'
})
export class StrapiAuthenticationService
  extends BaseAuthenticationService
  implements IStrapiAuthentication {

  /**
   * Token JWT proporcionado por Strapi.
   */
  private jwt_token: string | null = null;

  /**
   * Inicializa el servicio, carga token guardado y obtiene el usuario si está autenticado.
   *
   * @param signInUrl URL del endpoint de login
   * @param signUpUrl URL del endpoint de registro
   * @param meUrl URL del endpoint de `/me`
   * @param authMapping Servicio de mapeo para autenticación
   * @param httpClient Cliente HTTP para llamadas a Strapi
   */
  constructor(
    @Inject(AUTH_SIGN_IN_API_URL_TOKEN) protected signInUrl: string,
    @Inject(AUTH_SIGN_UP_API_URL_TOKEN) protected signUpUrl: string,
    @Inject(AUTH_ME_API_URL_TOKEN) protected meUrl: string,
    @Inject(AUTH_MAPPING_TOKEN) authMapping: IAuthMapping,
    private httpClient: HttpClient
  ) {
    console.log("El servicio de auth de Strapi se ha iniciado");
    super(authMapping);

    this.jwt_token = localStorage.getItem('customers-jwt-token');
    if (this.jwt_token) {
      this.me().subscribe({
        next: (resp) => {
          this._authenticated.next(true);
          this._user.next(this.authMapping.me(resp));
        },
        error: () => {
          this._authenticated.next(false);
          this._user.next(undefined);
        },
        complete: () => {
          this._ready.next(true);
        }
      });
    } else {
      this._ready.next(true);
    }
  }

  /**
   * Devuelve el token JWT actual.
   */
  getToken(): string | null {
    return this.jwt_token;
  }

  /**
   * Espera a que el servicio esté listo y devuelve el usuario actual.
   */
  async getCurrentUser(): Promise<any> {
    await firstValueFrom(this._ready.pipe(filter(ready => ready === true)));
    return firstValueFrom(this._user);
  }

  /**
   * Inicia sesión y guarda el token JWT en localStorage.
   */
  signIn(authPayload: any): Observable<User> {
    return this.httpClient.post<StrapiSignInResponse>(
      `${this.signInUrl}`,
      this.authMapping.signInPayload(authPayload)
    ).pipe(map((resp: StrapiSignInResponse) => {
      localStorage.setItem("customers-jwt-token", resp.jwt);
      this.jwt_token = resp.jwt;
      this._authenticated.next(true);
      this._user.next(this.authMapping.signIn(resp));
      return this.authMapping.signIn(resp);
    }));
  }

  /**
   * Registra un nuevo usuario en Strapi.
   */
  signUp(signUpPayload: any): Observable<User> {
    console.log('Payload enviado al backend:', this.authMapping.signUpPayload(signUpPayload));
    return this.httpClient.post<StrapiSignUpResponse>(
      `${this.signUpUrl}`,
      this.authMapping.signUpPayload(signUpPayload)
    ).pipe(map((resp: StrapiSignUpResponse) => {
      localStorage.setItem("customers-jwt-token", resp.jwt);
      this.jwt_token = resp.jwt;
      this._authenticated.next(true);
      return this.authMapping.signUp(resp);
    }));
  }

  /**
   * Cierra la sesión del usuario y borra el token.
   */
  signOut(): Observable<any> {
    return of(true).pipe(tap(() => {
      console.log("Borrando token: ", localStorage.getItem('customer-jwt-token'));
      localStorage.removeItem('customers-jwt-token');
      this._authenticated.next(false);
      this._user.next(undefined);
    }));
  }

  /**
   * Obtiene los datos del usuario autenticado desde Strapi (`/me`).
   */
  me(): Observable<any> {
    return this.httpClient.get<StrapiMeResponse>(
      `${this.meUrl}`, { headers: { Authorization: `Bearer ${this.jwt_token}` } }
    );
  }
}
