import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { User } from '../../models/user.model';
import { Event } from '../../models/event.model';
import { ThemeSelectorComponent } from '../../components/theme-selector/theme-selector.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ThemeSelectorComponent],
  template: `
    <div class="mx-auto max-w-7xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
      </div>

      <!-- Profile card -->
      <div *ngIf="currentUser" class="mb-8 rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div class="sm:flex sm:space-x-5">
            <div class="flex-shrink-0">
              <img
                *ngIf="currentUser.profileImage"
                [src]="currentUser.profileImage"
                alt=""
                class="mx-auto h-20 w-20 rounded-full object-cover"
              />
              <div
                *ngIf="!currentUser.profileImage"
                class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-semibold text-primary-800 dark:bg-primary-900 dark:text-primary-200"
              >
                {{ currentUser.name.charAt(0) }}
              </div>
            </div>
            <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Welcome back,</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{{ currentUser.name }}</p>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ currentUser.email }}</p>
            </div>
          </div>
          <div class="mt-5 flex justify-center sm:mt-0">
            <a
              href="#"
              class="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Edit Profile
            </a>
          </div>
        </div>
      </div>

      <!-- Personnalisation du thème -->
      <div class="mb-8 rounded-lg bg-white shadow-elevation-1 dark:bg-gray-800">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Personnalisation du thème</h2>
        </div>
        <app-theme-selector></app-theme-selector>
      </div>

      <!-- Stats -->
      <div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total events -->
        <div class="overflow-hidden rounded-lg bg-white p-5 shadow-elevation-1 dark:bg-gray-800">
          <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{{ events.length }}</dd>
        </div>

        <!-- Events by emotion -->
        <div class="overflow-hidden rounded-lg bg-white p-5 shadow-elevation-1 dark:bg-gray-800">
          <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Joy Events</dt>
          <dd class="mt-1 text-3xl font-semibold text-joy-600 dark:text-joy-400">
            {{ getJoyEventsCount() }}
          </dd>
        </div>

        <div class="overflow-hidden rounded-lg bg-white p-5 shadow-elevation-1 dark:bg-gray-800">
          <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Sad Events</dt>
          <dd class="mt-1 text-3xl font-semibold text-sadness-600 dark:text-sadness-400">
            {{ getSadEventsCount() }}
          </dd>
        </div>

        <div class="overflow-hidden rounded-lg bg-white p-5 shadow-elevation-1 dark:bg-gray-800">
          <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Angry Events</dt>
          <dd class="mt-1 text-3xl font-semibold text-anger-600 dark:text-anger-400">
            {{ getAngryEventsCount() }}
          </dd>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        <div class="mt-6 flow-root">
          <ul role="list" class="-mb-8">
            <li *ngFor="let event of events.slice(0, 5); let i = index">
              <div class="relative pb-8">
                <span
                  *ngIf="i !== events.slice(0, 5).length - 1"
                  class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                ></span>
                <div class="relative flex space-x-3">
                  <div>
                    <span
                      class="flex h-8 w-8 items-center justify-center rounded-full"
                      [ngClass]="{
                        'bg-joy-100 text-joy-800 dark:bg-joy-900 dark:text-joy-300': event.emotion === 'joy',
                        'bg-sadness-100 text-sadness-800 dark:bg-sadness-900 dark:text-sadness-300': event.emotion === 'sadness',
                        'bg-anger-100 text-anger-800 dark:bg-anger-900 dark:text-anger-300': event.emotion === 'anger',
                        'bg-fear-100 text-fear-800 dark:bg-fear-900 dark:text-fear-300': event.emotion === 'fear'
                      }"
                    >
                      {{ getEmotionIcon(event.emotion) }}
                    </span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div>
                      <div class="text-sm">
                        <a
                          [routerLink]="['/events', event.id]"
                          class="font-medium text-gray-900 dark:text-white"
                        >
                          {{ event.title }}
                        </a>
                      </div>
                      <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {{ event.createdAt | date:'medium' }}
                      </p>
                    </div>
                    <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      <p class="line-clamp-2">{{ event.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <!-- Empty state -->
            <li *ngIf="events.length === 0">
              <div class="py-4 text-center">
                <p class="text-gray-500 dark:text-gray-400">No activity yet. Create your first event!</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="mt-6">
          <a
            routerLink="/events"
            class="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-primary-600 shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-primary-400 dark:hover:bg-gray-600"
          >
            View all
          </a>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  events: Event[] = [];
  isLoading = true;

  constructor(private authService: AuthService, private eventService: EventService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: events => {
        this.events = events;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  getEmotionIcon(emotion: string): string {
    switch (emotion) {
      case 'joy':
        return '😊';
      case 'sadness':
        return '😢';
      case 'anger':
        return '😡';
      case 'fear':
        return '😨';
      default:
        return '😐';
    }
  }

  getJoyEventsCount(): number {
    return this.events.filter(e => e.emotion === 'joy').length;
  }

  getSadEventsCount(): number {
    return this.events.filter(e => e.emotion === 'sadness').length;
  }

  getAngryEventsCount(): number {
    return this.events.filter(e => e.emotion === 'anger').length;
  }

  getFearEventsCount(): number {
    return this.events.filter(e => e.emotion === 'fear').length;
  }
}