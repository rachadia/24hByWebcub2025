import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeLibraryService, ThemeStyle } from '../../services/theme-library.service';

@Component({
  selector: 'app-theme-library',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Bibliothèque de thèmes</h3>
      
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div 
          *ngFor="let theme of themeList" 
          class="relative flex cursor-pointer flex-col rounded-lg border p-4 transition-all hover:shadow-md"
          [class.border-primary-500]="selectedThemeId === theme.id"
          (click)="selectTheme(theme.id)"
        >
          <div 
            class="mb-2 h-12 w-full rounded-md"
            [style.background-color]="theme.previewColor"
          ></div>
          <div class="font-medium">{{ theme.name }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ theme.description }}</div>
          
          <div 
            *ngIf="selectedThemeId === theme.id" 
            class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div *ngIf="selectedTheme" class="mt-6">
        <h4 class="mb-2 text-lg font-medium">Aperçu de {{ selectedTheme.name }}</h4>
        
        <div 
          #previewElement
          class="p-6 rounded-lg transition-all duration-300"
          [ngClass]="isDarkMode ? selectedTheme.darkGradient : selectedTheme.lightGradient"
        >
          <div class="mb-4">
            <h5 class="text-xl font-bold" [style.color]="selectedTheme.colors.text">Exemple de titre</h5>
            <p [style.color]="selectedTheme.colors.text">Ceci est un exemple de texte avec le thème sélectionné.</p>
          </div>
          
          <div class="flex space-x-3">
            <button 
              class="px-4 py-2 rounded-md text-white"
              [style.background-color]="selectedTheme.colors.primary"
            >
              Bouton principal
            </button>
            
            <button 
              class="px-4 py-2 rounded-md"
              [style.background-color]="selectedTheme.colors.secondary"
              [style.color]="selectedTheme.colors.text"
            >
              Bouton secondaire
            </button>
          </div>
        </div>
        
        <div class="mt-4">
          <h4 class="mb-2 text-lg font-medium">Utilisation du thème</h4>
          <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <pre class="text-sm overflow-x-auto"><code>// Importer le ThemeLibraryService</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ThemeLibraryComponent implements OnInit {
  @Input() targetElement?: HTMLElement;
  
  themeList: { id: string, name: string, description: string, previewColor: string }[] = [];
  selectedThemeId: string = '';
  selectedTheme?: ThemeStyle;
  isDarkMode: boolean = false;
  
  constructor(private themeLibraryService: ThemeLibraryService) {}
  
  ngOnInit(): void {
    this.themeList = this.themeLibraryService.getThemeList();
    this.isDarkMode = document.documentElement.classList.contains('dark');
    
    // Sélectionner le premier thème par défaut
    if (this.themeList.length > 0) {
      this.selectTheme(this.themeList[0].id);
    }
  }
  
  selectTheme(themeId: string): void {
    this.selectedThemeId = themeId;
    this.selectedTheme = this.themeLibraryService.getTheme(themeId);
    
    // Si un élément cible est fourni, appliquer le thème
    if (this.targetElement && this.selectedTheme) {
      this.themeLibraryService.applyTheme(themeId, this.targetElement);
    }
  }
} 