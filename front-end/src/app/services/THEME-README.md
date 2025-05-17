# Système de Thèmes pour TheEnd.page

Ce document explique comment utiliser le système complet de thèmes de l'application TheEnd.page, incluant à la fois les thèmes standards et la bibliothèque de thèmes réutilisables.

## 1. Vue d'ensemble du système de thèmes

L'application dispose de deux systèmes de thèmes complémentaires :

1. **Thèmes Standards** : Les thèmes de base de l'application (Joyeux, Mélancolique, Passion, etc.)
2. **Bibliothèque de Thèmes Personnalisés** : Des thèmes réutilisables qui peuvent être appliqués à des sections spécifiques

Le système a été enrichi avec un **Gestionnaire de Thèmes Global** qui permet d'appliquer n'importe quel thème au niveau racine de l'application.

## 2. Thèmes Disponibles

### Thèmes Standards
- **Mode Joyeux** (`theme-joy`) - Tons roses et vifs
- **Mode Mélancolique** (`theme-sadness`) - Tons bleus apaisants
- **Mode Passion** (`theme-anger`) - Tons rouges chaleureux
- **Mode Neutre** (`theme-neutre`) - Tons gris équilibrés
- **Mode Intensité** (`theme-intensity`) - Tons violets énergiques

### Thèmes Personnalisés
- **Passion Sombre** (`dark-passion`) - Mode sombre du thème Passion 
- **Mélancolie Claire** (`light-melancholy`) - Mode clair du thème Mélancolique
- **Neutralité Claire** (`light-neutral`) - Mode clair du thème Neutre

## 3. Utilisation du Gestionnaire de Thèmes Global

### Option 1 : Utilisation via le service

```typescript
import { GlobalThemeManagerService } from 'src/app/services/global-theme-manager.service';

@Component({...})
export class MonComposant {
  constructor(private themeManager: GlobalThemeManagerService) {}
  
  changerThemeGlobal(): void {
    // Appliquer n'importe quel thème à l'application entière
    this.themeManager.applyTheme('dark-passion');
  }
}
```

### Option 2 : Utilisation via la fonction utilitaire

```typescript
import { appliquerTheme, THEMES } from 'src/app/utils/theme-utils';

// Dans une méthode de votre composant
appliquerThemePassionSombre(): void {
  appliquerTheme(THEMES.DARK_PASSION);
}
```

### Option 3 : Utilisation du composant de sélection de thème

Intégrez le sélecteur de thème dans votre interface :

```html
<app-theme-switcher></app-theme-switcher>
```

## 4. Thèmes Spécifiques pour Éléments Individuels

Si vous souhaitez appliquer des thèmes à des éléments spécifiques (plutôt qu'à toute l'application), vous pouvez utiliser les options suivantes :

### Option 1 : Utilisation de la directive

```html
<div [appThemeApply]="'light-melancholy'">
  Ce contenu aura le thème Mélancolie Claire
</div>
```

### Option 2 : Utilisation du service ThemeLibraryService

```typescript
import { ThemeLibraryService } from 'src/app/services/theme-library.service';

@Component({...})
export class MonComposant implements AfterViewInit {
  @ViewChild('monElement') monElement!: ElementRef<HTMLElement>;
  
  constructor(private themeLibrary: ThemeLibraryService) {}
  
  ngAfterViewInit(): void {
    this.themeLibrary.applyTheme('light-neutral', this.monElement.nativeElement);
  }
}
```

## 5. Compatibilité avec le Mode Sombre

Le système de thèmes est entièrement compatible avec le mode sombre :

- Les thèmes dont l'ID contient "dark" activent automatiquement le mode sombre
- Les autres thèmes utilisent le mode clair par défaut
- Le mode sombre/clair est synchronisé avec les préférences du système

## 6. Intégration dans une Nouvelle Page ou Composant

### Pour ajouter le sélecteur de thème dans une page

```typescript
import { Component } from '@angular/core';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-ma-page',
  standalone: true,
  imports: [CommonModule, ThemeSwitcherComponent],
  template: `
    <div class="container mx-auto">
      <h1>Ma Page</h1>
      
      <!-- Sélecteur de thème global -->
      <app-theme-switcher></app-theme-switcher>
      
      <!-- Contenu de la page -->
    </div>
  `
})
export class MaPageComponent {}
```

### Pour ajouter un bouton d'application de thème

```html
<button (click)="appliquerTheme(THEMES.DARK_PASSION)">
  Appliquer Passion Sombre
</button>
```

## 7. Exemples d'utilisation

### Exemple 1 : Changer le thème selon l'humeur d'un événement

```typescript
// Dans un composant de détail d'événement
appliquerThemeSelonHumeur(humeur: string): void {
  switch(humeur) {
    case 'joyeux':
      this.themeManager.applyTheme('theme-joy');
      break;
    case 'triste':
      this.themeManager.applyTheme('light-melancholy');
      break;
    case 'passionné':
      this.themeManager.applyTheme('dark-passion');
      break;
    default:
      this.themeManager.applyTheme('light-neutral');
  }
}
```

### Exemple 2 : Utilisation dans un service personnalisé

```typescript
@Injectable({
  providedIn: 'root'
})
export class HumeurService {
  constructor(private themeManager: GlobalThemeManagerService) {}
  
  definirHumeur(type: string): void {
    // Logique métier...
    
    // Changer le thème en fonction de l'humeur
    const themeMap = {
      'joyeux': 'theme-joy',
      'melancolique': 'light-melancholy',
      'intense': 'theme-intensity',
      'passionne': 'dark-passion'
    };
    
    const theme = themeMap[type] || 'light-neutral';
    this.themeManager.applyTheme(theme);
  }
}
```

## 8. Dépannage

Si vous rencontrez des problèmes :

1. Vérifiez que les services sont correctement importés et injectés
2. Assurez-vous que l'ID du thème existe dans la liste des thèmes disponibles
3. Consultez la console pour d'éventuels messages d'erreur
4. Pour les problèmes de performance, préférez l'utilisation du gestionnaire global plutôt que des directives multiples

## 9. Création de Nouveaux Thèmes

Pour ajouter un nouveau thème personnalisé, modifiez le fichier `theme-library.service.ts` et ajoutez-le au tableau `availableThemes` du service `GlobalThemeManagerService`. 
