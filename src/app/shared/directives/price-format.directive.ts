import { Directive, ElementRef, Input, OnChanges, Renderer2, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

/**
 * Directiva para formatear automáticamente un número como precio
 * según el idioma actual de la aplicación.
 *
 * Se actualiza automáticamente cuando cambia el idioma.
 */
@Directive({
  selector: '[appPriceFormat]'
})
export class PriceFormatDirective implements OnChanges, OnDestroy {

  /**
   * Precio que se desea formatear y mostrar.
   */
  @Input('appPriceFormat') price!: number | string;

  /**
   * Suscripción al evento de cambio de idioma.
   */
  private langChangeSubscription!: Subscription;

  /**
   * Constructor de la directiva.
   * @param el Elemento HTML al que se aplica la directiva
   * @param renderer Renderer Angular para modificar el DOM
   * @param translate Servicio de traducción para detectar idioma
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updatePrice(); 
    });
  }

  /**
   * Hook que se ejecuta cuando cambian los inputs.
   */
  ngOnChanges(): void {
    this.updatePrice();
  }

  /**
   * Hook que se ejecuta al destruir la directiva.
   * Cancela la suscripción al evento de cambio de idioma.
   */
  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  /**
   * Actualiza el contenido del elemento con el precio formateado
   * según el idioma actual.
   */
  private updatePrice(): void {
    const numericPrice = typeof this.price === 'number' ? this.price : parseFloat(this.price as unknown as string);
    if (isNaN(numericPrice)) {
      console.error('Invalid price value:', this.price);
      return;
    }

    const locale = this.translate.currentLang || 'en';
    const formattedPrice = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.getCurrencyByLocale(locale),
    }).format(numericPrice);

    this.renderer.setProperty(this.el.nativeElement, 'textContent', formattedPrice);
  }

  /**
   * Devuelve la moneda correspondiente al idioma proporcionado.
   * @param locale Código de idioma (ej. 'es', 'en')
   * @returns Código de moneda (ej. 'EUR', 'USD')
   */
  private getCurrencyByLocale(locale: string): string {
    const currencyMap: { [key: string]: string } = {
      en: 'USD',
      es: 'EUR',
      fr: 'EUR',
      pt: 'EUR',
      jp: 'JPY', 
    };
    return currencyMap[locale] || 'USD';
  }
}
