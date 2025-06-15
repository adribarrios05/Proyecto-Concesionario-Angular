import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Servicio para gestionar el idioma de la aplicación.
 * Utiliza `@ngx-translate/core` y guarda la preferencia en `localStorage`.
 *
 * @export
 * @class TranslationService
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  /**
   * Clave usada para guardar el idioma en `localStorage`.
   */
  private readonly LANG_KEY = 'SELECTED_LANGUAGE';

  /**
   * Inicializa el servicio de traducción cargando el idioma guardado o usando inglés por defecto.
   *
   * @param translate Servicio de `@ngx-translate/core`
   */
  constructor(private translate: TranslateService) {
    this.initTranslate();
  }

  /**
   * Carga el idioma previamente guardado o establece el idioma por defecto (`en`).
   */
  initTranslate() {
    const savedLang = localStorage.getItem(this.LANG_KEY) || 'en';
    this.setLanguage(savedLang);
  }

  /**
   * Cambia el idioma actual y guarda la preferencia.
   *
   * @param lang Código del idioma (por ejemplo: `es`, `en`)
   */
  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem(this.LANG_KEY, lang);
  }

  /**
   * Devuelve el idioma actualmente en uso.
   *
   * @returns Idioma actual (`en` si no está definido)
   */
  getCurrentLanguage(): string {
    return this.translate.currentLang || 'en';
  }
}
