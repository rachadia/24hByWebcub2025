import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalThemeManagerService } from '../../services/global-theme-manager.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-picker p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 class="text-lg font-medium mb-4">Choisir un thème global</h3>
      
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <button 
          *ngFor="let theme of themes"
          class="p-3 rounded-md border transition-all flex flex-col items-center"
          [class.border-primary-500]="currentTheme === theme.id"
          [class.bg-gray-100]="currentTheme === theme.id"
          [class.dark:bg-gray-700]="currentTheme === theme.id"
          (click)="applyTheme(theme.id)"
        >
          <span class="w-full h-6 mb-2 rounded" 
                [ngClass]="{'bg-joy-500': theme.id === 'theme-joy',
                           'bg-sadness-500': theme.id === 'theme-sadness',
                           'bg-anger-700': theme.id === 'theme-anger' || theme.id === 'dark-passion',
                           'bg-neutre-500': theme.id === 'theme-neutre' || theme.id === 'light-neutral',
                           'bg-intensity-500': theme.id === 'theme-intensity',
                           'bg-sadness-300': theme.id === 'light-melancholy'}">
          </span>
          <span>{{ theme.name }}</span>
        </button>
      </div>
    </div>
  `
})
export class ThemeSwitcherComponent implements OnInit {
  themes = this.themeManager.getAllThemes();
  currentTheme = '';
  
  constructor(private themeManager: GlobalThemeManagerService) {}
  
  ngOnInit(): void {
    this.currentTheme = this.themeManager.getCurrentTheme();
  }
  
  applyTheme(themeId: string): void {
    this.currentTheme = themeId;
    this.themeManager.applyTheme(themeId);
  }
} 