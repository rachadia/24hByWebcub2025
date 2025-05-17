import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { updateNeonColorForTheme } from '../../utils/theme-utils';
import { TheEndLogoComponent } from '../../components/the-end-logo/the-end-logo.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TheEndLogoComponent],
  template: `
    <div class="cosmic-bg relative overflow-hidden py-12 space-font min-h-screen">
      <!-- Étoiles scintillantes -->
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]" 
             class="star star-1" 
             [style.top.%]="getRandomPosition()" 
             [style.left.%]="getRandomPosition()"
             [style.animation-delay.s]="getRandomDelay()">
        </div>
        <div *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" 
             class="star star-2" 
             [style.top.%]="getRandomPosition()" 
             [style.left.%]="getRandomPosition()"
             [style.animation-delay.s]="getRandomDelay()">
        </div>
        <div *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]" 
             class="star star-3" 
             [style.top.%]="getRandomPosition()" 
             [style.left.%]="getRandomPosition()"
             [style.animation-delay.s]="getRandomDelay()">
        </div>
      </div>
      
      <!-- Hero section -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center">
          <!-- Grand logo en haut de la page -->
          <div class="mb-8 flex justify-center">
            <app-the-end-logo size="lg" [withLink]="false" className="transform scale-150"></app-the-end-logo>
          </div>
          
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span class="block">Partagez les moments</span>
            <span class="block text-primary-400">importants de votre vie</span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            The End Page vous aide à documenter les événements significatifs de votre vie, à suivre votre parcours émotionnel et à réfléchir sur vos
            expériences au fil du temps.
          </p>
          <div class="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            <div *ngIf="!isLoggedIn; else createEventButton" class="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <a
                routerLink="/auth/register"
                class="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 sm:px-8"
              >
                Commencer
              </a>
              <a
                routerLink="/auth/login"
                class="flex items-center justify-center rounded-md border border-gray-300 bg-gray-800/50 px-4 py-3 text-base font-medium text-gray-200 shadow-sm hover:bg-gray-700 sm:px-8"
              >
                Se connecter
              </a>
            </div>
            <ng-template #createEventButton>
              <a
                routerLink="/events/new"
                class="subtle-neon-button flex items-center justify-center px-4 py-3 text-base font-medium"
              >
                Créer un nouvel événement
              </a>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Feature section -->
      <div class="mt-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Comment ça marche
            </h2>
            <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Une façon simple de documenter votre parcours émotionnel.
            </p>
          </div>

          <div class="mt-16">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <!-- Feature 1 -->
              <div class="relative rounded-lg bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm border border-white/10">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600">
                  <span class="text-xl">✍️</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-white">Partagez vos expériences</h3>
                <p class="mt-3 text-gray-300">
                  Documentez des moments importants, joignez des médias et exprimez vos sentiments dans un espace personnel sécurisé.
                </p>
              </div>

              <!-- Feature 2 -->
              <div class="relative rounded-lg bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm border border-white/10">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600">
                  <span class="text-xl">🧠</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-white">Détection des émotions</h3>
                <p class="mt-3 text-gray-300">
                  Notre plateforme analyse vos entrées pour identifier les émotions et suggère des thèmes visuels adaptés à votre humeur.
                </p>
              </div>

              <!-- Feature 3 -->
              <div class="relative rounded-lg bg-gray-800/50 p-6 shadow-lg backdrop-blur-sm border border-white/10">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600">
                  <span class="text-xl">📊</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-white">Suivez votre parcours</h3>
                <p class="mt-3 text-gray-300">
                  Revisitez les événements passés, réfléchissez à votre évolution et observez comment vos émotions évoluent au fil du temps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA section -->
      <div class="mt-24 bg-gray-800/30 backdrop-blur-sm">
        <div class="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span class="block">Prêt à commencer votre voyage ?</span>
            <span class="block text-primary-400">Créez votre compte aujourd'hui.</span>
          </h2>
          <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div class="inline-flex rounded-md shadow">
              <a
                routerLink="/auth/register"
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-5 py-3 text-base font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                Commencer
              </a>
            </div>
            <div class="ml-3 inline-flex rounded-md shadow">
              <a
                routerLink="/auth/login"
                class="inline-flex items-center justify-center rounded-md border border-gray-600 bg-gray-800/70 px-5 py-3 text-base font-medium text-gray-200 hover:bg-gray-700"
              >
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
    
    // Initialiser la couleur néon pour le thème actuel (ici neutre par défaut)
    updateNeonColorForTheme('neutre');
  }
  
  // Fonctions auxiliaires pour positionner les étoiles aléatoirement
  getRandomPosition(): number {
    return Math.random() * 100;
  }
  
  getRandomDelay(): number {
    return Math.random() * 5;
  }
}