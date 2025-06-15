import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Servicio para gestionar el idioma de la aplicación usando ngx-translate.
 * Permite cambiar, almacenar y recuperar el idioma seleccionado.
 *
 * @export
 * @class LanguageService
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  /**
   * Clave utilizada para almacenar el idioma en `localStorage`.
   */
  private readonly LANG_KEY = 'selectedLanguage';

  /**
   * Idioma predeterminado si no se encuentra otro configurado.
   */
  private defaultLang = 'es';

  /**
   * Inicializa los idiomas disponibles, establece uno por defecto y aplica
   * el idioma almacenado o detectado en el navegador.
   *
   * @param translate Servicio de traducción de ngx-translate
   */
  constructor(private translate: TranslateService) {
    translate.addLangs(['es', 'en', 'fr', 'it', 'pt', 'de', 'jp', 'ar']);
    translate.setDefaultLang('es');
    
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang?.match(/es|en|fr|it|pt|jp|de|ar/) ? browserLang : 'es');

    const storedLang = this.getStoredLanguage();
    this.changeLanguage(storedLang);
  }

  /**
   * Cambia el idioma actual de la aplicación.
   *
   * @param lang Código del idioma (ej: 'es', 'en')
   */
  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  /**
   * Devuelve el idioma actualmente activo en la aplicación.
   *
   * @returns Código del idioma actual
   */
  getCurrentLang(): string {
    return this.translate.currentLang;
  }

  /**
   * Recupera el idioma almacenado previamente en `localStorage`.
   *
   * @returns Código del idioma almacenado o el idioma por defecto
   */
  getStoredLanguage(): string {
    return localStorage.getItem(this.LANG_KEY) || this.defaultLang;
  }

  /**
   * Almacena el idioma seleccionado en `localStorage` para persistencia.
   *
   * @param lang Código del idioma a guardar
   */
  storeLanguage(lang: string): void {
    localStorage.setItem(this.LANG_KEY, lang);
  }
}
