import { Inject, Injectable } from '@angular/core';
import { filter, map, Observable, of, tap, firstValueFrom, from, throwError, catchError, BehaviorSubject } from 'rxjs';
import { BaseAuthenticationService } from './base-authentication.service';
import { AUTH_MAPPING_TOKEN, FIREBASE_CONFIG_TOKEN } from '../../repositories/repository.tokens';
import { IAuthMapping } from '../interfaces/auth-mapping.interface';
import { User } from '../../models/auth.model';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { Firestore, getFirestore, doc, getDoc } from 'firebase/firestore';

/**
 * Servicio de autenticación usando Firebase.
 * Extiende el servicio base `BaseAuthenticationService` y define los métodos reales de autenticación.
 *
 * @export
 * @class FirebaseAuthenticationService
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService extends BaseAuthenticationService {

  /**
   * Instancia de Firebase Auth.
   */
  private auth;

  /**
   * Token de acceso JWT proporcionado por Firebase.
   */
  private _token: string | null = null;

  /**
   * Inicializa Firebase, escucha cambios en el estado de autenticación
   * y sincroniza el estado interno del servicio.
   *
   * @param firebaseConfig Configuración del proyecto Firebase
   * @param authMapping Servicio de mapeo de usuarios
   */
  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig = {
      apiKey: "...",
      authDomain: "...",
      projectId: "...",
      storageBucket: "...",
      messagingSenderId: "...",
      appId: "...",
      measurementId: "..."
    },
    @Inject(AUTH_MAPPING_TOKEN) authMapping: IAuthMapping
  ) {
    super(authMapping);
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);

    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this._token = await user.getIdToken();
        this._authenticated.next(true);
        const mappedUser = this.authMapping.me(user);
        this._user.next(mappedUser);
        this.updateAuthState(mappedUser);
      } else {
        this._token = null;
        this._authenticated.next(false);
        this._user.next(undefined);
        this.updateAuthState(null);
      }
      this._ready.next(true);
    });
  }

  /**
   * Espera a que el servicio esté listo y retorna el usuario actual.
   *
   * @returns Usuario autenticado
   */
  async getCurrentUser(): Promise<any> {
    await firstValueFrom(this._ready.pipe(filter(ready => ready === true)));
    return firstValueFrom(this._user);
  }

  /**
   * Inicia sesión con email y contraseña.
   *
   * @param authPayload Objeto con credenciales
   * @returns Observable con el usuario autenticado
   */
  signIn(authPayload: any): Observable<User> {
    const { email, password } = this.authMapping.signInPayload(authPayload);
    console.log("Email: ", email, " Password: ", password);

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => {
        const mappedUser = this.authMapping.signIn(userCredential.user);
        this.updateAuthState(mappedUser);
        return mappedUser;
      })
    );
  }

  /**
   * Registra un nuevo usuario en Firebase Authentication.
   *
   * @param signUpPayload Datos de registro
   * @returns Observable con el usuario registrado
   */
  signUp(signUpPayload: any): Observable<User> {
    const { email, password } = this.authMapping.signUpPayload(signUpPayload);

    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => {
        return this.authMapping.signUp(userCredential.user);
      })
    );
  }

  /**
   * Cierra la sesión del usuario actual.
   *
   * @returns Observable que completa al cerrar sesión
   */
  signOut(): Observable<any> {
    return from(firebaseSignOut(this.auth)).pipe(
      tap(() => {
        this.updateAuthState(null);
      })
    );
  }

  /**
   * Devuelve los datos del usuario autenticado si existe.
   *
   * @returns Observable con los datos del usuario
   */
  me(): Observable<any> {
    return new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          observer.next({ id: user.uid, email: user.email });
        } else {
          observer.error(new Error('No authenticated user'));
        }
      }, (error) => {
        observer.error(error);
      });
    });
  }

  /**
   * Devuelve el token actual de autenticación (JWT).
   *
   * @returns Token de usuario autenticado
   */
  getToken(): string | null {
    return this._token;
  }
}
