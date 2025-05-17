import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('fr');
  currentLang$ = this.currentLang.asObservable();

  constructor(private translate: TranslateService) {
    // Définir les langues disponibles
    translate.addLangs(['fr', 'en']);
    // Définir la langue par défaut
    translate.setDefaultLang('fr');
    // Utiliser la langue du navigateur si disponible
    const browserLang = translate.getBrowserLang();
    const lang = browserLang?.match(/fr|en/) ? browserLang : 'fr';
    this.setLanguage(lang);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.next(lang);
    document.documentElement.lang = lang;
  }

  getCurrentLang(): string {
    return this.currentLang.value;
  }
} 