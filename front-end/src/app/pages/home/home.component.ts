import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="relative overflow-hidden py-12">
      <!-- Hero section -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span class="block">{{ 'HOME.HERO.TITLE_1' | translate }}</span>
            <span class="block text-primary-600 dark:text-primary-400">{{ 'HOME.HERO.TITLE_2' | translate }}</span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            {{ 'HOME.HERO.DESCRIPTION' | translate }}
          </p>
          <div class="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            <div *ngIf="!isLoggedIn; else createEventButton" class="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <a
                routerLink="/auth/register"
                class="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 sm:px-8"
              >
                {{ 'HOME.CTA.GET_STARTED' | translate }}
              </a>
              <a
                routerLink="/auth/login"
                class="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:px-8"
              >
                {{ 'HOME.CTA.LOGIN' | translate }}
              </a>
            </div>
            <ng-template #createEventButton>
              <div class="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                <a
                  routerLink="/events/new"
                  class="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 sm:px-8"
                >
                  {{ 'HOME.CTA.CREATE_EVENT' | translate }}
                </a>
                <a
                  routerLink="/events/podium"
                  class="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:px-8"
                >
                  <span class="mr-2">🏆</span> Hall of Fame
                </a>
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Feature section -->
      <div class="mt-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {{ 'HOME.FEATURES.TITLE' | translate }}
            </h2>
            <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              {{ 'HOME.FEATURES.SUBTITLE' | translate }}
            </p>
          </div>

          <div class="mt-16">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <!-- Feature 1 -->
              <div class="relative rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 dark:bg-primary-700">
                  <span class="text-xl">✍️</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-gray-900 dark:text-white">{{ 'HOME.FEATURES.FEATURE_1.TITLE' | translate }}</h3>
                <p class="mt-3 text-gray-600 dark:text-gray-300">
                  {{ 'HOME.FEATURES.FEATURE_1.DESCRIPTION' | translate }}
                </p>
              </div>

              <!-- Feature 2 -->
              <div class="relative rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 dark:bg-primary-700">
                  <span class="text-xl">🧠</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-gray-900 dark:text-white">{{ 'HOME.FEATURES.FEATURE_2.TITLE' | translate }}</h3>
                <p class="mt-3 text-gray-600 dark:text-gray-300">
                  {{ 'HOME.FEATURES.FEATURE_2.DESCRIPTION' | translate }}
                </p>
              </div>

              <!-- Feature 3 -->
              <div class="relative rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 dark:bg-primary-700">
                  <span class="text-xl">📊</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-gray-900 dark:text-white">{{ 'HOME.FEATURES.FEATURE_3.TITLE' | translate }}</h3>
                <p class="mt-3 text-gray-600 dark:text-gray-300">
                  {{ 'HOME.FEATURES.FEATURE_3.DESCRIPTION' | translate }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA section -->
      <div class="mt-24 bg-primary-50 dark:bg-gray-800/50">
        <div class="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            <span class="block">{{ 'HOME.JOURNEY.TITLE_1' | translate }}</span>
            <span class="block text-primary-600 dark:text-primary-400">{{ 'HOME.JOURNEY.TITLE_2' | translate }}</span>
          </h2>
          <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div class="inline-flex rounded-md shadow">
              <a
                routerLink="/auth/register"
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-5 py-3 text-base font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {{ 'HOME.CTA.GET_STARTED' | translate }}
              </a>
            </div>
            <div *ngIf="isLoggedIn" class="ml-3 inline-flex rounded-md shadow">
              <a
                routerLink="/events/podium"
                class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <span class="mr-2">🏆</span> Hall of Fame
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