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

export function updateNeonColorForTheme(themeName: string): void {
  const themeColorMap: Record<string, string> = {
    'joy': '--joy-color-rgb',
    'sadness': '--sadness-color-rgb',
    'anger': '--anger-color-rgb',
    'fear': '--fear-color-rgb',
    'neutre': '--neutre-color-rgb',
    'intensity': '--intensity-color-rgb',
    'default': '--primary-color-rgb'
  };

  // Récupérer la variable CSS associée au thème
  const colorVariable = themeColorMap[themeName] || themeColorMap['default'];
  const colorValue = getComputedStyle(document.documentElement).getPropertyValue(colorVariable);

  // Appliquer cette couleur comme couleur primaire pour les effets néon
  document.documentElement.style.setProperty('--current-theme-rgb', colorValue);
} 