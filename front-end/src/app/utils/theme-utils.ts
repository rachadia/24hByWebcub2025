/**
 * Utilitaires pour la gestion des thèmes
 */

// Fonction simplifiée pour appliquer un thème global depuis n'importe où
export function appliquerTheme(themeId: string): void {
  // Récupérer l'instance du service (utilisation via window pour accès global)
  const globalThemeManager = (window as any).globalThemeManager;
  
  if (!globalThemeManager) {
    console.error("Le gestionnaire de thèmes n'est pas disponible. Assurez-vous que l'application est correctement initialisée.");
    return;
  }
  
  globalThemeManager.applyTheme(themeId);
}

// Liste des thèmes disponibles pour référence rapide
export const THEMES = {
  // Thèmes standard
  JOY: 'theme-joy',
  SADNESS: 'theme-sadness',
  ANGER: 'theme-anger',
  NEUTRAL: 'theme-neutre',
  INTENSITY: 'theme-intensity',
  
  // Thèmes personnalisés
  DARK_PASSION: 'dark-passion',
  LIGHT_MELANCHOLY: 'light-melancholy',
  LIGHT_NEUTRAL: 'light-neutral'
}; 