import { Injectable } from '@angular/core';

export interface ThemeStyle {
  name: string;
  description: string;
  previewColor: string;
  lightMode: string;
  darkMode: string;
  lightGradient: string;
  darkGradient: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ThemeLibraryService {
  // Thèmes réutilisables créés à partir d'extraits des thèmes existants
  public themeLibrary: { [key: string]: ThemeStyle } = {
    // Mode sombre du thème Passion (Anger)
    'dark-passion': {
      name: 'Passion Sombre',
      description: 'Le mode sombre du thème Passion avec des tons rouges profonds',
      previewColor: '#b91c1c', // anger-700
      lightMode: '',
      darkMode: 'bg-anger-950 text-white',
      lightGradient: '',
      darkGradient: 'bg-gradient-to-br from-anger-950 to-anger-900',
      colors: {
        primary: '#dc2626', // anger-600
        secondary: '#991b1b', // anger-800
        text: '#ffffff',
        background: '#450a0a', // anger-950
      }
    },
    
    // Mode clair du thème Mélancolique (Sadness)
    'light-melancholy': {
      name: 'Mélancolie Claire',
      description: 'Le mode clair du thème Mélancolique avec des tons bleus apaisants',
      previewColor: '#3b82f6', // sadness-500
      lightMode: 'bg-sadness-50 text-sadness-900',
      darkMode: '',
      lightGradient: 'bg-gradient-to-br from-sadness-50 to-sadness-100',
      darkGradient: '',
      colors: {
        primary: '#3b82f6', // sadness-500
        secondary: '#93c5fd', // sadness-300
        text: '#1e3a8a', // sadness-900
        background: '#eff6ff', // sadness-50
      }
    },
    
    // Mode clair du thème Neutre
    'light-neutral': {
      name: 'Neutralité Claire',
      description: 'Le mode clair du thème Neutre avec des tons gris équilibrés',
      previewColor: '#6b7280', // neutre-500
      lightMode: 'bg-neutre-50 text-neutre-900',
      darkMode: '',
      lightGradient: 'bg-gradient-to-br from-neutre-50 to-neutre-100',
      darkGradient: '',
      colors: {
        primary: '#6b7280', // neutre-500
        secondary: '#d1d5db', // neutre-300
        text: '#111827', // neutre-900
        background: '#f9fafb', // neutre-50
      }
    }
  };

  constructor() { }

  // Obtenir un thème spécifique
  getTheme(themeId: string): ThemeStyle | undefined {
    return this.themeLibrary[themeId];
  }

  // Obtenir tous les thèmes réutilisables
  getAllThemes(): { [key: string]: ThemeStyle } {
    return this.themeLibrary;
  }

  // Obtenir la liste des thèmes pour l'affichage dans un sélecteur
  getThemeList(): {id: string, name: string, description: string, previewColor: string}[] {
    return Object.entries(this.themeLibrary).map(([id, theme]) => ({
      id,
      name: theme.name,
      description: theme.description,
      previewColor: theme.previewColor
    }));
  }

  // Appliquer un thème spécifique
  applyTheme(themeId: string, element: HTMLElement): void {
    const theme = this.themeLibrary[themeId];
    
    if (!theme) return;
    
    // Réinitialiser les classes existantes
    element.className = element.className.replace(/bg-\w+-\d+|text-\w+-\d+|bg-gradient-to-\w+\s+from-\w+-\d+\s+to-\w+-\d+/g, '');
    
    // Appliquer le mode clair ou sombre selon le contexte
    if (document.documentElement.classList.contains('dark') && theme.darkMode) {
      element.classList.add(...theme.darkMode.split(' '));
      
      if (theme.darkGradient) {
        element.classList.add(...theme.darkGradient.split(' '));
      }
    } else if (theme.lightMode) {
      element.classList.add(...theme.lightMode.split(' '));
      
      if (theme.lightGradient) {
        element.classList.add(...theme.lightGradient.split(' '));
      }
    }
  }
} 