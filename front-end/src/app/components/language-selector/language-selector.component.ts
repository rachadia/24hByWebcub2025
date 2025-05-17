import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="flex items-center space-x-2">
      <button
        (click)="switchLanguage('fr')"
        [class.font-bold]="currentLang === 'fr'"
        class="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {{ 'COMMON.FRENCH' | translate }}
      </button>
      <span class="text-gray-400">|</span>
      <button
        (click)="switchLanguage('en')"
        [class.font-bold]="currentLang === 'en'"
        class="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {{ 'COMMON.ENGLISH' | translate }}
      </button>
    </div>
  `,
})
export class LanguageSelectorComponent {
  currentLang: string;

  constructor(private languageService: LanguageService) {
    this.currentLang = this.languageService.getCurrentLang();
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  switchLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
} 