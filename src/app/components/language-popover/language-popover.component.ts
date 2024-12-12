import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-popover',
  templateUrl: './language-popover.component.html',
  styleUrls: ['./language-popover.component.scss']
})
export class LanguagePopoverComponent {
  languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'jp', label: '日本語' },
    { code: 'pt', label: 'Português' },
    { code: 'ar', label: 'عربي' },
  ];
  currentLang = this.translateService.currentLang

  constructor(
    private translateService: TranslateService,
    private popoverController: PopoverController
  ) {}

  changeLanguage(lang: string) {
    this.translateService.use(lang);
    localStorage.setItem('selectedLanguage', lang)
    this.popoverController.dismiss();
  }
}
