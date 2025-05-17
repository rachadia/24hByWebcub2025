import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { EmotionService } from '../../../services/emotion.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="mx-auto max-w-7xl">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ 'EVENTS.LIST.TITLE' | translate }}</h1>
        <a
          routerLink="/events/new"
          class="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
        >
          {{ 'EVENTS.NEW' | translate }}
        </a>
      </div>

      <!-- Filter tabs -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li class="mr-2">
            <a
              (click)="filterEvents('all'); $event.preventDefault()"
              href="#"
              [ngClass]="{
                'inline-block p-4 text-primary-600 border-b-2 border-primary-600 rounded-t-lg dark:text-primary-400 dark:border-primary-400': 
                  activeFilter === 'all',
                'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': 
                  activeFilter !== 'all'
              }"
            >
              {{ 'EVENTS.LIST.FILTERS.ALL' | translate }}
            </a>
          </li>
          <li class="mr-2">
            <a
              (click)="filterEvents('joy'); $event.preventDefault()"
              href="#"
              [ngClass]="{
                'inline-block p-4 text-joy-600 border-b-2 border-joy-600 rounded-t-lg dark:text-joy-400 dark:border-joy-400': 
                  activeFilter === 'joy',
                'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': 
                  activeFilter !== 'joy'
              }"
            >
              {{ 'EVENTS.EMOTIONS.JOY' | translate }}
            </a>
          </li>
          <li class="mr-2">
            <a
              (click)="filterEvents('sadness'); $event.preventDefault()"
              href="#"
              [ngClass]="{
                'inline-block p-4 text-sadness-600 border-b-2 border-sadness-600 rounded-t-lg dark:text-sadness-400 dark:border-sadness-400': 
                  activeFilter === 'sadness',
                'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': 
                  activeFilter !== 'sadness'
              }"
            >
              {{ 'EVENTS.EMOTIONS.SADNESS' | translate }}
            </a>
          </li>
          <li class="mr-2">
            <a
              (click)="filterEvents('anger'); $event.preventDefault()"
              href="#"
              [ngClass]="{
                'inline-block p-4 text-anger-600 border-b-2 border-anger-600 rounded-t-lg dark:text-anger-400 dark:border-anger-400': 
                  activeFilter === 'anger',
                'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': 
                  activeFilter !== 'anger'
              }"
            >
              {{ 'EVENTS.EMOTIONS.ANGER' | translate }}
            </a>
          </li>
          <li>
            <a
              (click)="filterEvents('fear'); $event.preventDefault()"
              href="#"
              [ngClass]="{
                'inline-block p-4 text-fear-600 border-b-2 border-fear-600 rounded-t-lg dark:text-fear-400 dark:border-fear-400': 
                  activeFilter === 'fear',
                'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300': 
                  activeFilter !== 'fear'
              }"
            >
              {{ 'EVENTS.EMOTIONS.FEAR' | translate }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Event list -->
      <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3" *ngIf="filteredEvents.length > 0">
        <div *ngFor="let event of filteredEvents" class="card overflow-hidden" [ngClass]="event.theme">
          <div class="mb-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ event.title }}</h3>
              <span class="badge-primary">{{ 'EVENTS.EMOTIONS.' + event.emotion.toUpperCase() | translate }}</span>
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ event.createdAt | date:'medium' }}
            </p>
          </div>
          <p class="line-clamp-3 text-gray-700 dark:text-gray-300">{{ event.content }}</p>
          
          <!-- Attachments -->
          <div *ngIf="event.attachments && event.attachments.length > 0" class="mt-4">
            <div class="grid grid-cols-3 gap-2">
              <div *ngFor="let attachment of event.attachments.slice(0, 3)" class="relative h-20 overflow-hidden rounded-md">
                <img
                  [src]="attachment"
                  [alt]="'EVENTS.LIST.ATTACHMENT_ALT' | translate"
                  class="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="mt-4 flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span class="mr-2">💬 {{ event.comments.length }}</span>
              <span>❤️ {{ event.likes }}</span>
            </div>
            <a 
              [routerLink]="['/events', event.id]"
              class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {{ 'EVENTS.LIST.VIEW_EVENT' | translate }} →
            </a>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="filteredEvents.length === 0" class="py-12 text-center">
        <div class="flex justify-center">
          <span class="text-4xl">📝</span>
        </div>
        <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{{ 'EVENTS.LIST.NO_EVENTS_FOUND' | translate }}</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ 'EVENTS.LIST.GET_STARTED' | translate }}
        </p>
        <div class="mt-6">
          <a
            routerLink="/events/new"
            class="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:bg-primary-700 dark:hover:bg-primary-600"
          >
            <span class="mr-2">+</span>
            {{ 'EVENTS.NEW' | translate }}
          </a>
        </div>
      </div>
    </div>
  `,
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  activeFilter = 'all';
  isLoading = true;

  constructor(
    private eventService: EventService, 
    private emotionService: EmotionService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: events => {
        this.events = events;
        this.filteredEvents = [...this.events];
        this.isLoading = false;
      },
      error: error => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  filterEvents(filter: string): void {
    this.activeFilter = filter;

    if (filter === 'all') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event => event.emotion === filter);
    }
  }

  getEmotionDisplayName(emotion: string): string {
    return this.emotionService.getEmotionDisplayName(emotion as any);
  }
}