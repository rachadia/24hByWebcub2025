import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeLibraryService } from '../../../services/theme-library.service';
import { ThemeApplyDirective } from '../../../directives/theme-apply.directive';
import { ThemeLibraryComponent } from '../../../components/theme-library/theme-library.component';

@Component({
  selector: 'app-theme-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeApplyDirective, ThemeLibraryComponent],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="mb-8 text-3xl font-bold">Démonstration des thèmes</h1>
      
      <div class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold">1. Utilisation de la directive</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <!-- Exemple 1: Mode sombre du thème Passion -->
          <div 
            class="rounded-lg p-6 shadow-md transition-all"
            [appThemeApply]="'dark-passion'"
          >
            <h3 class="mb-3 text-xl font-semibold">Passion Sombre</h3>
            <p class="mb-4">Ce bloc utilise le mode sombre du thème Passion.</p>
            <button class="rounded-md bg-anger-600 px-4 py-2 text-white hover:bg-anger-700">
              Bouton d'action
            </button>
          </div>
          
          <!-- Exemple 2: Mode clair du thème Mélancolique -->
          <div 
            class="rounded-lg p-6 shadow-md transition-all"
            [appThemeApply]="'light-melancholy'"
          >
            <h3 class="mb-3 text-xl font-semibold">Mélancolie Claire</h3>
            <p class="mb-4">Ce bloc utilise le mode clair du thème Mélancolique.</p>
            <button class="rounded-md bg-sadness-500 px-4 py-2 text-white hover:bg-sadness-600">
              Bouton d'action
            </button>
          </div>
          
          <!-- Exemple 3: Mode clair du thème Neutre -->
          <div 
            class="rounded-lg p-6 shadow-md transition-all"
            [appThemeApply]="'light-neutral'"
          >
            <h3 class="mb-3 text-xl font-semibold">Neutralité Claire</h3>
            <p class="mb-4">Ce bloc utilise le mode clair du thème Neutre.</p>
            <button class="rounded-md bg-neutre-500 px-4 py-2 text-white hover:bg-neutre-600">
              Bouton d'action
            </button>
          </div>
        </div>
      </div>
      
      <div class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold">2. Utilisation du service directement</h2>
        <div class="mb-4">
          <label for="theme-select" class="mb-1 block text-sm font-medium">Choisir un thème</label>
          <select 
            id="theme-select"
            [(ngModel)]="selectedTheme"
            (change)="applySelectedTheme()"
            class="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option *ngFor="let theme of themeList" [value]="theme.id">{{ theme.name }}</option>
          </select>
        </div>
        
        <div #targetElement class="rounded-lg p-6 shadow-md transition-all">
          <h3 class="mb-3 text-xl font-semibold">Thème appliqué dynamiquement</h3>
          <p class="mb-4">Ce bloc change de thème dynamiquement selon la sélection ci-dessus.</p>
          <div class="mb-4">
            <input type="text" placeholder="Exemple de champ texte" class="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
          </div>
          <div class="flex space-x-3">
            <button class="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
              Action principale
            </button>
            <button class="rounded-md border border-gray-300 bg-transparent px-4 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">
              Action secondaire
            </button>
          </div>
        </div>
      </div>
      
      <div class="mt-12">
        <h2 class="mb-4 text-2xl font-semibold">3. Bibliothèque complète</h2>
        <app-theme-library [targetElement]="demoElement"></app-theme-library>
        
        <div #demoElement class="mt-8 rounded-lg p-6 shadow-md transition-all">
          <h3 class="mb-3 text-xl font-semibold">Démo avec le composant de bibliothèque</h3>
          <p class="mb-4">Ce bloc change de thème en fonction de la sélection dans la bibliothèque ci-dessus.</p>
          <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium">Champ de formulaire</label>
              <input type="text" placeholder="Entrez du texte" class="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium">Liste déroulante</label>
              <select class="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <button class="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
              Bouton principal
            </button>
            <button class="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              Bouton secondaire
            </button>
            <button class="rounded-md border border-primary-600 bg-transparent px-4 py-2 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-gray-800">
              Bouton outline
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ThemeDemoComponent implements OnInit {
  themeList: {id: string, name: string, description: string, previewColor: string}[] = [];
  selectedTheme: string = 'dark-passion';
  
  constructor(private themeLibraryService: ThemeLibraryService) {}
  
  ngOnInit(): void {
    this.themeList = this.themeLibraryService.getThemeList();
  }
  
  applySelectedTheme(): void {
    const targetElement = document.querySelector('#targetElement') as HTMLElement;
    if (targetElement && this.selectedTheme) {
      this.themeLibraryService.applyTheme(this.selectedTheme, targetElement);
    }
  }
} 