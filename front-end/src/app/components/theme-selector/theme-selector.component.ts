import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeOption } from '../../services/theme.service';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Choisissez votre thème</h3>
      
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div 
          *ngFor="let theme of themes" 
          class="relative flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:shadow-md"
          [class.border-primary-500]="currentTheme === theme.id"
          (click)="setTheme(theme.id)"
        >
          <div 
            class="mb-2 h-12 w-full rounded-md"
            [style.background-color]="theme.previewColor"
          ></div>
          <div class="font-medium">{{ theme.name }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ theme.description }}</div>
          
          <div 
            *ngIf="currentTheme === theme.id" 
            class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="mt-4 flex items-center">
        <label for="toggle-dark-mode" class="mr-2 text-sm">Mode sombre</label>
        <button 
          id="toggle-dark-mode"
          class="relative inline-flex h-6 w-11 items-center rounded-full"
          [class.bg-primary-500]="isDarkMode"
          [class.bg-gray-200]="!isDarkMode"
          (click)="toggleDarkMode()"
        >
          <span 
            class="inline-block h-4 w-4 rounded-full bg-white transition-transform"
            [class.translate-x-6]="isDarkMode"
            [class.translate-x-1]="!isDarkMode"
          ></span>
        </button>
      </div>
    </div>
  `,
})
export class ThemeSelectorComponent {
  themes: ThemeOption[] = [];
  currentTheme = '';
  isDarkMode = false;

  constructor(private themeService: ThemeService) {
    //this.themes = this.themeService.availableThemes;
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
    this.isDarkMode = this.themeService.isDarkMode();
  }

  setTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
    this.isDarkMode = this.themeService.isDarkMode();
  }
} 