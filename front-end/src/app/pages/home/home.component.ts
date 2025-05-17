import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="theme-cosmic relative overflow-hidden py-12">
      <!-- Hero section -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="font-cosmic">
            <span class="block text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-2">
              Partagez vos
            </span>
            <span class="block text-gradient text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl glow">
              moments importants
            </span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            The End Page vous aide à documenter les événements significatifs de votre vie, à suivre votre parcours émotionnel et à réfléchir sur vos
            expériences au fil du temps.
          </p>
          <div class="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            <div *ngIf="!isLoggedIn; else createEventButton" class="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <a
                routerLink="/auth/register"
                class="btn-cosmic flex items-center justify-center rounded-md border border-transparent px-4 py-3 text-base font-medium text-white shadow-sm sm:px-8"
              >
                Commencer
              </a>
              <a
                routerLink="/auth/login"
                class="btn-cosmic-outline flex items-center justify-center rounded-md px-4 py-3 text-base font-medium shadow-sm sm:px-8"
              >
                Se connecter
              </a>
            </div>
            <ng-template #createEventButton>
              <a
                routerLink="/events/new"
                class="btn-cosmic flex items-center justify-center rounded-md border border-transparent px-4 py-3 text-base font-medium text-white shadow-sm"
              >
                Créer un nouvel événement
              </a>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Feature section -->
      <div class="mt-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl font-cosmic">
              Comment ça marche
            </h2>
            <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
              Une façon simple de documenter votre parcours émotionnel.
            </p>
          </div>

          <div class="mt-16">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <!-- Feature 1 -->
              <div class="relative rounded-lg p-6 neo-blur">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-endpage-pink">
                  <span class="text-xl">✍️</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-white font-cosmic">Partagez vos expériences</h3>
                <p class="mt-3 text-gray-300">
                  Documentez des moments importants, joignez des médias et exprimez vos sentiments dans un espace personnel sécurisé.
                </p>
              </div>

              <!-- Feature 2 -->
              <div class="relative rounded-lg p-6 neo-blur">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-endpage-purple">
                  <span class="text-xl">🧠</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-white font-cosmic">Détection des émotions</h3>
                <p class="mt-3 text-gray-300">
                  Notre plateforme analyse vos entrées pour identifier les émotions et suggère des thèmes visuels adaptés à votre humeur.
                </p>
              </div>

              <!-- Feature 3 -->
              <div class="relative rounded-lg p-6 neo-blur">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-endpage-pink">
                  <span class="text-xl">📊</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-white font-cosmic">Suivez votre parcours</h3>
                <p class="mt-3 text-gray-300">
                  Revisitez les événements passés, réfléchissez à votre évolution et observez comment vos émotions évoluent au fil du temps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA section -->
      <div class="mt-24 bg-endpage-dark bg-opacity-50 backdrop-blur-sm">
        <div class="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl font-cosmic">
            <span class="block text-white">Prêt à commencer votre voyage ?</span>
            <span class="block text-gradient glow">Créez votre compte aujourd'hui.</span>
          </h2>
          <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div class="inline-flex rounded-md shadow">
              <a
                routerLink="/auth/register"
                class="btn-cosmic inline-flex items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium text-white"
              >
                Commencer
              </a>
            </div>
            <div class="ml-3 inline-flex rounded-md shadow">
              <a
                routerLink="/auth/login"
                class="btn-cosmic-outline inline-flex items-center justify-center rounded-md px-5 py-3 text-base font-medium"
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
  }
}