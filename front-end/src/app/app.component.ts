import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="cosmic-body flex min-h-screen flex-col" [ngClass]="currentTheme || 'theme-cosmic'">
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

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Si aucun thème n'est défini, utiliser le thème cosmique
    if (!this.currentTheme) {
      this.themeService.setTheme('theme-cosmic');
    }

    // Activer le mode sombre par défaut pour le thème cosmique
    document.documentElement.classList.add('dark');

    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }

    // Listen for changes in color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        // Toujours conserver le mode sombre pour le thème cosmique
        if (this.currentTheme === 'theme-cosmic') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  }
}