import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { Emotion, EmotionService } from '../../../services/emotion.service';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-4xl">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Event</h1>
        <a
          [routerLink]="['/events', eventId]"
          class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </a>
      </div>

      <div *ngIf="isLoading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>

      <div *ngIf="!isLoading && event" class="rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
          <div class="mb-6">
            <label for="title" class="label">Title</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="input"
              placeholder="Give your event a title"
              [ngClass]="{
                'border-red-500 dark:border-red-400': 
                  eventForm.get('title')?.invalid && 
                  (eventForm.get('title')?.dirty || eventForm.get('title')?.touched)
              }"
            />
            <div 
              *ngIf="eventForm.get('title')?.invalid && 
                  (eventForm.get('title')?.dirty || eventForm.get('title')?.touched)"
              class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              <div *ngIf="eventForm.get('title')?.errors?.['required']">Title is required</div>
            </div>
          </div>

          <div class="mb-6">
            <label for="content" class="label">Your Event</label>
            <textarea
              id="content"
              formControlName="content"
              rows="6"
              class="textarea"
              placeholder="Describe what happened and how you feel about it..."
              [ngClass]="{
                'border-red-500 dark:border-red-400': 
                  eventForm.get('content')?.invalid && 
                  (eventForm.get('content')?.dirty || eventForm.get('content')?.touched)
              }"
            ></textarea>
            <div 
              *ngIf="eventForm.get('content')?.invalid && 
                  (eventForm.get('content')?.dirty || eventForm.get('content')?.touched)"
              class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              <div *ngIf="eventForm.get('content')?.errors?.['required']">Content is required</div>
              <div *ngIf="eventForm.get('content')?.errors?.['minlength']">
                Content must be at least 10 characters
              </div>
            </div>
          </div>

          <div class="mb-6" *ngIf="detectedEmotion">
            <div class="rounded-md bg-gray-50 p-4 dark:bg-gray-700">
              <div class="flex">
                <div class="flex-shrink-0">
                  <span class="text-2xl">{{ emotionIcon }}</span>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Detected Mood: {{ emotionDisplayName }}
                  </h3>
                  <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                      Based on your text, we've detected a {{ emotionDisplayName.toLowerCase() }} mood.
                      Your event will be styled with a matching theme.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <a
              [routerLink]="['/events', eventId]"
              class="mr-3 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </a>
            <button
              type="submit"
              [disabled]="eventForm.invalid || isSubmitting"
              class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              <span *ngIf="isSubmitting" class="mr-2">
                <svg
                  class="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              Update Event
            </button>
          </div>
        </form>
      </div>

      <!-- Event not found -->
      <div *ngIf="!isLoading && !event" class="rounded-lg bg-white p-8 text-center shadow-elevation-1 dark:bg-gray-800">
        <div class="mb-4 text-4xl">😕</div>
        <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Event not found</h3>
        <p class="mb-6 text-gray-600 dark:text-gray-400">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <a
          routerLink="/events"
          class="inline-block rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
        >
          Back to Events
        </a>
      </div>
    </div>
  `,
})
export class EventEditComponent implements OnInit {
  eventForm: FormGroup;
  event: Event | undefined;
  eventId: string;
  isLoading = true;
  isSubmitting = false;
  detectedEmotion: string = '';
  emotionDisplayName = '';
  emotionIcon = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private emotionService: EmotionService
  ) {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(10)]],
      attachments: [[]]
    });

    // Listen to content changes to detect emotion
    this.eventForm.get('content')?.valueChanges.subscribe(content => {
      if (content && content.length > 20) {
        this.detectedEmotion = this.emotionService.detectEmotion(content);
        this.emotionDisplayName = this.emotionService.getEmotionDisplayName(this.detectedEmotion as Emotion);
        this.emotionIcon = this.emotionService.getEmotionIcon(this.detectedEmotion as Emotion);
      } else {
        this.detectedEmotion = '';
      }
    });
  }

  ngOnInit(): void {
    if (this.eventId) {
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: string): void {
    this.eventService.getEventById(id).subscribe({
      next: event => {
        this.event = event;
        if (event) {
          this.eventForm.patchValue({
            title: event.title,
            content: event.content
          });
          
          this.detectedEmotion = event.emotion;
          this.emotionDisplayName = this.emotionService.getEmotionDisplayName(this.detectedEmotion as Emotion);
          this.emotionIcon = this.emotionService.getEmotionIcon(this.detectedEmotion as Emotion);
        }
        this.isLoading = false;
      },
      error: error => {
        console.error('Error loading event:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid || !this.event) {
      return;
    }

    this.isSubmitting = true;

    this.eventService.updateEvent(this.event.id, this.eventForm.value).subscribe({
      next: event => {
        this.router.navigate(['/events', event.id]);
      },
      error: error => {
        console.error('Error updating event:', error);
        this.isSubmitting = false;
      }
    });
  }
}