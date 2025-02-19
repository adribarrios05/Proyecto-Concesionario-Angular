import { Inject, Injectable } from '@angular/core';
import { filter, map, Observable, of, tap, firstValueFrom, from } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService extends BaseAuthenticationService {
  private auth;
  private _token: string | null = null;

  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig = {
      apiKey: "AIzaSyDXjHUKnlhNBpIpfdxOZlAKb1vykp8ElPo",
      authDomain: "concesionarios-baca.firebaseapp.com",
      projectId: "concesionarios-baca",
      storageBucket: "concesionarios-baca.firebasestorage.app",
      messagingSenderId: "1098140390614",
      appId: "1:1098140390614:web:f468fba37feeba8ddea577",
      measurementId: "G-FWC8EPFFQG"
    },
    @Inject(AUTH_MAPPING_TOKEN) authMapping: IAuthMapping
  ) {
    console.log("El servicio de autenticacion de firebase se ha iniciado")
    super(authMapping);
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);

    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this._token = await user.getIdToken();
        this._authenticated.next(true);
        this._user.next(this.authMapping.me(user));
      } else {
        this._token = null;
        this._authenticated.next(false);
        this._user.next(undefined);
      }
      this._ready.next(true);
    });
  }

  async getCurrentUser(): Promise<any> {
    await firstValueFrom(this._ready.pipe(filter(ready => ready === true)));
    return firstValueFrom(this._user);
  }

  signIn(authPayload: any): Observable<User> {
    const { email, password } = this.authMapping.signInPayload(authPayload);
    
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => {
        return this.authMapping.signIn(userCredential.user);
      })
    );
  }

  signUp(signUpPayload: any): Observable<User> {
    const { email, password } = this.authMapping.signUpPayload(signUpPayload);
    
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => {
        return this.authMapping.signUp(userCredential.user);
      })
    );
  }

  signOut(): Observable<any> {
    return from(firebaseSignOut(this.auth)).pipe(
      tap(() => {
        this._authenticated.next(false);
        this._user.next(undefined);
      })
    );
  }

  me(): Observable<any> {
    return of(this.auth.currentUser).pipe(
      map(user => {
        if (!user) {
          throw new Error('No authenticated user');
        }
        return user;
      })
    );
  }

  getToken(): string | null {
    return this._token;
  }
} 