import { Directive, ElementRef, Input, OnChanges, Renderer2, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appPriceFormat]'
})
export class PriceFormatDirective implements OnChanges, OnDestroy {
  @Input('appPriceFormat') price!: number | string; 
  private langChangeSubscription!: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updatePrice(); 
    });
  }

  ngOnChanges() {
    this.updatePrice();
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  private updatePrice() {
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
