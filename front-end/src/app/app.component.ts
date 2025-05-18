import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { GlobalThemeManagerService } from './services/global-theme-manager.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { GlobalThemeManagerService } from './services/global-theme-manager.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, TranslateModule],
  template: `
    <div class="flex min-h-screen flex-col" [ngClass]="currentTheme">
      <app-header></app-header>
      <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
})
export class AppComponent implements OnInit {
  currentTheme = '';

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private globalThemeManager: GlobalThemeManagerService
  ) {
    // Rendre le gestionnaire de thèmes accessible globalement
    (window as any).globalThemeManager = this.globalThemeManager;
  }
  

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Récupérer le thème global sauvegardé
    const savedGlobalTheme = localStorage.getItem('globalTheme');
    if (savedGlobalTheme) {
      this.globalThemeManager.applyTheme(savedGlobalTheme);
    } else {
      // Si aucun thème global n'est défini, procéder avec la logique existante
      
      // Récupérer le thème sauvegardé
      const savedTheme = localStorage.getItem('theme');
      const isLoggedIn = this.authService.isAuthenticated();
      
      // Si l'utilisateur est connecté et a déjà choisi un thème
      if (isLoggedIn && savedTheme) {
        // Si le thème sauvegardé est 'theme-fear' (supprimé), utiliser un thème épanouissant
        if (savedTheme === 'theme-fear') {
          this.themeService.setTheme('theme-intensity');
        } else {
          // Sinon, conserver son choix précédent
          this.themeService.setTheme(savedTheme);
        }
      } 
      // Si aucun thème n'est défini ou si l'utilisateur n'est pas connecté et n'a pas de préférence
      else if (!this.currentTheme || !savedTheme) {
        // Attribuer un thème épanouissant par défaut (alternance entre Intensité et Joyeux)
        const randomTheme = Math.random() > 0.5 ? 'theme-intensity' : 'theme-joy';
        this.themeService.setTheme(randomTheme);
      }
    }

    // Vérifier la préférence de mode sombre/clair
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true' || (darkMode === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Écouter les changements de préférence
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (e.matches && localStorage.getItem('darkMode') !== 'false') {
        document.documentElement.classList.add('dark');
      } else if (!e.matches && localStorage.getItem('darkMode') !== 'true') {
        document.documentElement.classList.remove('dark');
      }
    });
  }
}