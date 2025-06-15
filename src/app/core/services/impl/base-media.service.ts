import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

/**
 * Servicio abstracto base para subida de archivos multimedia.
 * Las implementaciones deben definir cómo se realiza el `upload`.
 *
 * @export
 * @abstract
 * @class BaseMediaService
 * @template T Tipo de retorno esperado (por defecto `number`)
 */
@Injectable({
  providedIn: 'root'
})
export abstract class BaseMediaService<T = number> {
  /**
   * Sube un archivo en formato Blob.
   *
   * @param blob Archivo a subir
   * @returns Observable con el resultado del tipo `T[]`
   */
  abstract upload(blob: Blob): Observable<T[]>;
}
