import { Inject, Injectable } from "@angular/core";
import { IAuthentication } from "../interfaces/authentication.interface";
import { BehaviorSubject, Observable } from "rxjs";
import { IAuthMapping } from "../interfaces/auth-mapping.interface";
import { User } from "../../models/auth.model";

/**
 * Servicio base abstracto para autenticación.
 * Implementa flujos reactivos para manejar el estado de autenticación y el usuario actual.
 * Las clases hijas deben implementar los métodos abstractos de autenticación.
 *
 * @export
 * @abstract
 * @class BaseAuthenticationService
 * @implements {IAuthentication}
 */
@Injectable({
  providedIn: 'root'
})
export abstract class BaseAuthenticationService implements IAuthentication {

  /**
   * Estado reactivo que indica si el usuario está autenticado.
   */
  protected _authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Observable público del estado de autenticación.
   */
  public authenticated$: Observable<boolean> = this._authenticated.asObservable();

  /**
   * Usuario actualmente autenticado.
   */
  protected _user: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);

  /**
   * Observable público del usuario actual.
   */
  public user$: Observable<User | undefined> = this._user.asObservable();

  /**
   * Estado reactivo para indicar si el sistema de autenticación está listo.
   */
  protected _ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Observable público del estado de preparación de autenticación.
   */
  public ready$: Observable<boolean> = this._ready.asObservable();

  /**
   * Estado reactivo con los cambios en el usuario autenticado.
   */
  protected _authState: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  /**
   * Observable del estado actual de autenticación (user login/logout).
   */
  public authState$: Observable<User | null> = this._authState.asObservable();

  /**
   * Constructor base que recibe un mapeador de autenticación.
   *
   * @param authMapping Mapeador para transformar datos de autenticación
   */
  constructor(protected authMapping: IAuthMapping) {}

  /**
   * Obtiene el usuario actual (autenticado) de forma síncrona o asincrónica.
   */
  abstract getCurrentUser(): Promise<any>;

  /**
   * Inicia sesión con las credenciales proporcionadas.
   *
   * @param authPayload Objeto con credenciales o datos de inicio
   */
  abstract signIn(authPayload: any): Observable<any>;

  /**
   * Registra un nuevo usuario.
   *
   * @param registerPayload Datos del nuevo usuario
   */
  abstract signUp(registerPayload: any): Observable<any>;

  /**
   * Cierra sesión del usuario autenticado.
   */
  abstract signOut(): Observable<any>;

  /**
   * Obtiene la información del usuario autenticado.
   */
  abstract me(): Observable<any>;

  /**
   * Actualiza el estado interno de autenticación.
   *
   * @param user Usuario autenticado o `null` si ha cerrado sesión
   */
  protected updateAuthState(user: User | null) {
    this._authState.next(user);
  }
}
