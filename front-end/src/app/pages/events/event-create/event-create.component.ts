import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { EmotionService, Emotion } from '../../../services/emotion.service';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-4xl">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create New Event</h1>
        <a
          routerLink="/events"
          class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Back to Events
        </a>
      </div>

      <div class="rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
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

          <div class="mb-6">
            <label class="label">Attachments</label>
            <div class="flex items-center justify-center w-full">
              <label
                for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    aria-hidden="true"
                    class="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 2MB)
                  </p>
                </div>
                <input id="dropzone-file" type="file" class="hidden" />
              </label>
            </div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              (File uploads will be available in a future update)
            </p>
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
            <button
              type="button"
              routerLink="/events"
              class="mr-3 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
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
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class EventCreateComponent {
  eventForm: FormGroup;
  isSubmitting = false;
  detectedEmotion: Emotion | '' = '';
  emotionDisplayName = '';
  emotionIcon = '';

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private emotionService: EmotionService,
    private router: Router
  ) {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(10)]],
      attachments: [[]]
    });

    // Listen to content changes to detect emotion
    this.eventForm.get('content')?.valueChanges.subscribe(content => {
      if (content && content.length > 20) {
        this.detectedEmotion = this.emotionService.detectEmotion(content);
        this.emotionDisplayName = this.emotionService.getEmotionDisplayName(this.detectedEmotion);
        this.emotionIcon = this.emotionService.getEmotionIcon(this.detectedEmotion);
      } else {
        this.detectedEmotion = '';
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    this.eventService.createEvent(this.eventForm.value).subscribe({
      next: event => {
        this.router.navigate(['/events', event.id]);
      },
      error: error => {
        console.error('Error creating event:', error);
        this.isSubmitting = false;
      }
    });
  }
}