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

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Appliquer le thème par défaut si aucun n'est défini
    if (!this.currentTheme) {
      this.themeService.setTheme('theme-neutre');
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