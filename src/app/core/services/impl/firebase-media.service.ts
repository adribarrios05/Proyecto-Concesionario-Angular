import { Inject, Injectable } from "@angular/core";
import { BaseMediaService } from "./base-media.service";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  StorageReference
} from "firebase/storage";
import { from, map, Observable, switchMap } from "rxjs";
import { AUTH_TOKEN, FIREBASE_CONFIG_TOKEN } from "../../repositories/repository.tokens";
import { initializeApp } from "firebase/app";
import { IAuthentication } from "../interfaces/authentication.interface";

/**
 * Servicio de subida de archivos a Firebase Storage.
 * Extiende `BaseMediaService` para subir blobs y devolver URLs públicas.
 *
 * @export
 * @class FirebaseMediaService
 * @extends {BaseMediaService<string>}
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseMediaService extends BaseMediaService<string> {
  /**
   * Instancia de Firebase Storage.
   */
  private storage;

  /**
   * Inicializa Firebase y obtiene el servicio de almacenamiento.
   *
   * @param firebaseConfig Configuración de Firebase inyectada
   * @param auth Servicio de autenticación para obtener el usuario actual
   */
  constructor(
    @Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any,
    @Inject(AUTH_TOKEN) private auth: IAuthentication
  ) {
    super();
    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);
  }

  /**
   * Sube un archivo al storage y devuelve su URL pública.
   *
   * @param blob Archivo en formato Blob
   * @returns Observable con la URL subida
   */
  public upload(blob: Blob): Observable<string[]> {
    return from(this.auth.getCurrentUser()).pipe(
      switchMap(user => {
        if (!user) throw new Error('Usuario no autenticado');

        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
        const storageRef: StorageReference = ref(this.storage, `uploads/${fileName}`);

        const metadata = {
          contentType: blob.type,
          customMetadata: {
            'uploaded-by': user.id || 'anonymous'
          }
        };

        return from(uploadBytes(storageRef, blob, metadata)).pipe(
          switchMap(snapshot => getDownloadURL(snapshot.ref)),
          map((url): [string] => {
            if (!url) throw new Error("Firebase no devolvió una URL.");
            console.log("📌 URL de imagen subida a Firebase:", url);
            return [url];
          })
        );
      })
    );
  }
}
