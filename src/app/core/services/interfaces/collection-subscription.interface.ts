import { Observable } from "rxjs";
import { Model } from "../../models/base.model";

/**
 * Representa un cambio detectado en una colección observada.
 */
export interface CollectionChange<T> {
  /** Tipo de cambio: añadido, modificado o eliminado. */
  type: 'added' | 'modified' | 'removed';

  /** Datos asociados al documento (opcional en 'removed'). */
  data?: T;

  /** ID del documento afectado. */
  id: string;
}

/**
 * Interfaz para gestionar suscripciones a cambios en colecciones.
 */
export interface ICollectionSubscription<T extends Model> {
  /**
   * Se suscribe a los cambios de una colección específica.
   * @param collectionName Nombre de la colección.
   */
  subscribe(collectionName: string): Observable<CollectionChange<T>>;

  /**
   * Cancela la suscripción a una colección.
   * @param collectionName Nombre de la colección.
   */
  unsubscribe(collectionName: string): void;
}
