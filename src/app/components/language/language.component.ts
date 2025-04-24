import { ChangeDetectorRef, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'language-selector',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent {
  currentLang = 'en';
  dropdownOpen = false;

  constructor(private _translateService: TranslateService,
    private _cdr: ChangeDetectorRef
  ) {
    this.currentLang = this._translateService.getDefaultLang() || 'en';
    this._translateService.setDefaultLang(this.currentLang);
    this._translateService.use(this.currentLang);
  }
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  switchLanguage(lang: 'en' | 'el'): void {
    this.currentLang = lang;
    this._translateService.use(lang);
    this.dropdownOpen = false;
    this._cdr.detectChanges();
  }
}
