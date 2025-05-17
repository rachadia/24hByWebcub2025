import { Injectable } from '@angular/core';
import { ThemeService } from './theme.service';
import { ThemeLibraryService } from './theme-library.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalThemeManagerService {
  // Liste complète de tous les thèmes disponibles
  availableThemes = [
    // Thèmes standard
    { id: 'theme-joy', name: 'Mode Joyeux', type: 'standard' },
    { id: 'theme-sadness', name: 'Mode Mélancolique', type: 'standard' },
    { id: 'theme-anger', name: 'Mode Passion', type: 'standard' },
    { id: 'theme-neutre', name: 'Mode Neutre', type: 'standard' },
    { id: 'theme-intensity', name: 'Mode Intensité', type: 'standard' },
    
    // Thèmes personnalisés
    { id: 'dark-passion', name: 'Passion Sombre', type: 'custom' },
    { id: 'light-melancholy', name: 'Mélancolie Claire', type: 'custom' },
    { id: 'light-neutral', name: 'Neutralité Claire', type: 'custom' }
  ];
  
  constructor(
    private themeService: ThemeService,
    private themeLibraryService: ThemeLibraryService
  ) {}
  
  /**
   * Applique n'importe quel thème disponible globalement
   */
  applyTheme(themeId: string): void {
    // Trouver le thème dans la liste complète
    const theme = this.availableThemes.find(t => t.id === themeId);
    
    if (!theme) {
      console.warn(`Thème non trouvé: ${themeId}`);
      return;
    }
    
    // Déterminer s'il s'agit d'un thème sombre
    const isDarkTheme = themeId.includes('dark');
    
    // Activer/désactiver le mode sombre
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    
    // Appliquer le thème selon son type
    if (theme.type === 'custom') {
      this.themeLibraryService.applyTheme(themeId, document.documentElement);
    } else {
      this.themeService.setTheme(themeId);
    }
    
    // Sauvegarder la préférence
    localStorage.setItem('globalTheme', themeId);
  }
  
  /**
   * Récupère tous les thèmes disponibles (standard + personnalisés)
   */
  getAllThemes() {
    return this.availableThemes;
  }
  
  /**
   * Récupère le thème actuel
   */
  getCurrentTheme(): string {
    return localStorage.getItem('globalTheme') || '';
  }
} 