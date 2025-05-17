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
    <div class="relative overflow-hidden py-12">
      <!-- Hero section -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span class="block">Share Your Life's</span>
            <span class="block text-primary-600 dark:text-primary-400">Meaningful Moments</span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            The End Page helps you document life's significant events, track your emotional journey, and reflect on your
            experiences over time.
          </p>
          <div class="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            <div *ngIf="!isLoggedIn; else createEventButton" class="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <a
                routerLink="/auth/register"
                class="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 sm:px-8"
              >
                Get started
              </a>
              <a
                routerLink="/auth/login"
                class="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:px-8"
              >
                Log in
              </a>
            </div>
            <ng-template #createEventButton>
              <a
                routerLink="/events/new"
                class="flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                Create a new event
              </a>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Feature section -->
      <div class="mt-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How it works
            </h2>
            <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              A simple way to chronicle your emotional journey.
            </p>
          </div>

          <div class="mt-16">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <!-- Feature 1 -->
              <div class="relative rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 dark:bg-primary-700">
                  <span class="text-xl">✍️</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-gray-900 dark:text-white">Share Your Experiences</h3>
                <p class="mt-3 text-gray-600 dark:text-gray-300">
                  Document significant moments, attach media, and express your feelings in a secure personal space.
                </p>
              </div>

              <!-- Feature 2 -->
              <div class="relative rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 dark:bg-primary-700">
                  <span class="text-xl">🧠</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-gray-900 dark:text-white">Emotion Detection</h3>
                <p class="mt-3 text-gray-600 dark:text-gray-300">
                  Our platform analyzes your entries to identify emotions and suggests visual themes to match your mood.
                </p>
              </div>

              <!-- Feature 3 -->
              <div class="relative rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
                <div class="absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 dark:bg-primary-700">
                  <span class="text-xl">📊</span>
                </div>
                <h3 class="mt-8 text-xl font-semibold text-gray-900 dark:text-white">Track Your Journey</h3>
                <p class="mt-3 text-gray-600 dark:text-gray-300">
                  Revisit past events, reflect on your growth, and see how your emotions evolve over time.
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
            <span class="block">Ready to start your journey?</span>
            <span class="block text-primary-600 dark:text-primary-400">Create your account today.</span>
          </h2>
          <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div class="inline-flex rounded-md shadow">
              <a
                routerLink="/auth/register"
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-5 py-3 text-base font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                Get started
              </a>
            </div>
            <div class="ml-3 inline-flex rounded-md shadow">
              <a
                routerLink="/auth/login"
                class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Learn more
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