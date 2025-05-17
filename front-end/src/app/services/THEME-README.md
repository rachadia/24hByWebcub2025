# Bibliothèque de Thèmes Réutilisables pour TheEnd.page

Cette bibliothèque permet de réutiliser facilement des aspects spécifiques des thèmes existants dans différentes parties de l'application TheEnd.page. Elle offre une solution modulaire pour appliquer des styles cohérents à des éléments spécifiques, indépendamment du thème global de l'application.

## Thèmes disponibles

La bibliothèque contient actuellement les thèmes suivants :

1. **Passion Sombre** (`dark-passion`) - Le mode sombre du thème Passion avec des tons rouges profonds
   - Idéal pour les sections qui nécessitent une ambiance intense ou dramatique
   - Parfait pour les contenus liés à des moments forts en émotions

2. **Mélancolie Claire** (`light-melancholy`) - Le mode clair du thème Mélancolique avec des tons bleus apaisants
   - Adapté pour les sections qui évoquent la nostalgie ou la réflexion
   - Convient aux contenus plus sensibles ou contemplatifs

3. **Neutralité Claire** (`light-neutral`) - Le mode clair du thème Neutre avec des tons gris équilibrés
   - Parfait pour les sections qui doivent rester neutres
   - Idéal pour les contenus informatifs ou factuels

## Méthodes d'utilisation

### 1. Utilisation de la directive (Méthode recommandée)

La méthode la plus simple est d'utiliser la directive `appThemeApply` :

```html
<div [appThemeApply]="'dark-passion'">
  Ce contenu utilisera le thème Passion Sombre
</div>
```

Cette approche est idéale pour appliquer un thème à un bloc spécifique dans un composant.

### 2. Utilisation du service `ThemeLibraryService`

Pour plus de flexibilité et un contrôle dynamique, vous pouvez injecter et utiliser le service directement :

```typescript
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ThemeLibraryService } from 'src/app/services/theme-library.service';

@Component({...})
export class MonComposant {
  @ViewChild('monElement') monElement!: ElementRef<HTMLElement>;
  
  constructor(private themeLibraryService: ThemeLibraryService) {}
  
  ngAfterViewInit() {
    // Appliquer un thème fixe
    this.themeLibraryService.applyTheme('light-melancholy', this.monElement.nativeElement);
  }
  
  changerTheme(themeId: string): void {
    // Changer le thème dynamiquement
    this.themeLibraryService.applyTheme(themeId, this.monElement.nativeElement);
  }
}
```

Cette approche est recommandée lorsque vous souhaitez changer le thème en fonction des interactions utilisateur.

### 3. Utilisation du composant `ThemeLibraryComponent`

Pour une interface complète de sélection de thèmes :

```html
<app-theme-library [targetElement]="monElement"></app-theme-library>

<div #monElement>
  Ce contenu changera de thème en fonction de la sélection dans le composant ci-dessus
</div>
```

Cette méthode est utile lorsque vous souhaitez offrir à l'utilisateur une interface pour sélectionner et prévisualiser les thèmes.

## Compatibilité avec le mode sombre

La bibliothèque de thèmes est entièrement compatible avec le mode sombre de l'application. Les thèmes s'adapteront automatiquement :

- Si le mode sombre est activé, les propriétés `darkMode` et `darkGradient` du thème seront utilisées
- Si le mode clair est activé, les propriétés `lightMode` et `lightGradient` seront utilisées

## Exemple complet

Une démonstration complète est disponible à l'URL : `/test/theme-demo`

Cette page démontre les trois méthodes d'utilisation des thèmes et vous permet de voir comment ils s'adaptent à différents éléments d'interface.

## Dépannage

Si vous rencontrez des problèmes avec la bibliothèque de thèmes :

1. Assurez-vous que la directive `ThemeApplyDirective` est bien importée dans votre module ou component standalone
2. Vérifiez que l'ID du thème existe bien dans la bibliothèque
3. Si le thème ne s'applique pas, vérifiez la console pour d'éventuelles erreurs

## Étendre la bibliothèque

### Créer un nouveau thème

Pour ajouter un nouveau thème à la bibliothèque, modifiez le fichier `theme-library.service.ts` :

```typescript
// Dans le constructeur de ThemeLibraryService ou dans une méthode dédiée
this.themeLibrary['mon-nouveau-theme'] = {
  name: 'Mon Nouveau Thème',
  description: 'Description du thème',
  previewColor: '#hexcode',
  lightMode: 'bg-color-50 text-color-900',
  darkMode: 'bg-color-950 text-white',
  lightGradient: 'bg-gradient-to-br from-color-50 to-color-100',
  darkGradient: 'bg-gradient-to-br from-color-950 to-color-900',
  colors: {
    primary: '#hexcode',
    secondary: '#hexcode',
    text: '#hexcode',
    background: '#hexcode',
  }
};
```

### Utiliser les thèmes dans des composants personnalisés

Vous pouvez également créer vos propres composants qui utilisent la bibliothèque de thèmes :

```typescript
@Component({
  selector: 'app-themed-card',
  template: `
    <div class="card" [appThemeApply]="themeId">
      <div class="card-header">{{ title }}</div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ThemeApplyDirective]
})
export class ThemedCardComponent {
  @Input() themeId: string = 'light-neutral';
  @Input() title: string = '';
}
```

Utilisation :
```html
<app-themed-card themeId="dark-passion" title="Mon titre">
  Contenu de la carte
</app-themed-card>
```
