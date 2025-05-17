import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { EmotionService, Emotion } from '../../../services/emotion.service';
import { NlpService } from '../../../services/nlp.service';
import { Observable } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FaceDetectionService } from '../../../services/face-detection.service';

import { MoodAnalysisResult, MoodAnalysisService } from '../../../services/mood-analysis.service';
import { SentimentAnalysisService } from '../../../services/sentiment-analysis.service';

interface FaceExpressions {
  angry: number;
  disgusted: number;
  fearful: number;
  happy: number;
  neutral: number;
  sad: number;
  surprised: number;
}

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="mx-auto max-w-4xl">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ 'EVENTS.CREATE.TITLE' | translate }}</h1>
        <a
          routerLink="/events"
          class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          {{ 'EVENTS.LIST.TITLE' | translate }}
        </a>
      </div>

      <div class="rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
          <div class="mb-6">
            <label for="title" class="label">{{ 'EVENTS.CREATE.FORM.TITLE' | translate }}</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="input"
              [placeholder]="'EVENTS.CREATE.FORM.TITLE_PLACEHOLDER' | translate"
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
              <div *ngIf="eventForm.get('title')?.errors?.['required']">{{ 'EVENTS.CREATE.FORM.TITLE' | translate }} {{ 'COMMON.REQUIRED' | translate }}</div>
            </div>
          </div>

          <div class="mb-6">
            <label for="description" class="label">{{ 'EVENTS.CREATE.FORM.DESCRIPTION' | translate }}</label>
            <textarea
              id="description"
              formControlName="description"
              rows="3"
              class="textarea"
              [placeholder]="'EVENTS.CREATE.FORM.DESCRIPTION_PLACEHOLDER' | translate"
              [ngClass]="{
                'border-red-500 dark:border-red-400': 
                  eventForm.get('description')?.invalid && 
                  (eventForm.get('description')?.dirty || eventForm.get('description')?.touched)
              }"
            ></textarea>
            <div 
              *ngIf="eventForm.get('description')?.invalid && 
                  (eventForm.get('description')?.dirty || eventForm.get('description')?.touched)"
              class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              <div *ngIf="eventForm.get('description')?.errors?.['required']">{{ 'EVENTS.CREATE.FORM.DESCRIPTION' | translate }} {{ 'COMMON.REQUIRED' | translate }}</div>
              <div *ngIf="eventForm.get('description')?.errors?.['minlength']">
                {{ 'EVENTS.CREATE.FORM.DESCRIPTION' | translate }} {{ 'COMMON.MIN_LENGTH' | translate }}
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label for="content" class="label">{{ 'EVENTS.CREATE.FORM.CONTENT' | translate }}</label>
            <textarea
              id="content"
              formControlName="content"
              rows="6"
              class="textarea"
              [placeholder]="'EVENTS.CREATE.FORM.CONTENT_PLACEHOLDER' | translate"
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
              <div *ngIf="eventForm.get('content')?.errors?.['required']">{{ 'EVENTS.CREATE.FORM.CONTENT' | translate }} {{ 'COMMON.REQUIRED' | translate }}</div>
              <div *ngIf="eventForm.get('content')?.errors?.['minlength']">
                {{ 'EVENTS.CREATE.FORM.CONTENT' | translate }} {{ 'COMMON.MIN_LENGTH' | translate }}
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label for="emotion" class="label">{{ 'EVENTS.CREATE.FORM.EMOTION' | translate }}</label>
            <select
              id="emotion"
              formControlName="emotion"
              class="input"
              [ngClass]="{
                'border-red-500 dark:border-red-400': 
                  eventForm.get('emotion')?.invalid && 
                  (eventForm.get('emotion')?.dirty || eventForm.get('emotion')?.touched)
              }"
            >
              <option value="">{{ 'EVENTS.CREATE.FORM.EMOTION_PLACEHOLDER' | translate }}</option>
              <option value="joy">😊 {{ 'EVENTS.EMOTIONS.JOY' | translate }}</option>
              <option value="content">😌 {{ 'EVENTS.EMOTIONS.CONTENT' | translate }}</option>
              <option value="sadness">😢 {{ 'EVENTS.EMOTIONS.SADNESS' | translate }}</option>
              <option value="anger">😡 {{ 'EVENTS.EMOTIONS.ANGER' | translate }}</option>
              <option value="fear">😨 {{ 'EVENTS.EMOTIONS.FEAR' | translate }}</option>
            </select>
            <div 
              *ngIf="eventForm.get('emotion')?.invalid && 
                  (eventForm.get('emotion')?.dirty || eventForm.get('emotion')?.touched)"
              class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              <div *ngIf="eventForm.get('emotion')?.errors?.['required']">{{ 'EVENTS.CREATE.FORM.EMOTION' | translate }} {{ 'COMMON.REQUIRED' | translate }}</div>
            </div>
          </div>

          <div class="mb-6">
            <label class="label">{{ 'EVENTS.CREATE.FORM.MEDIA' | translate }}</label>
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
                    <span class="font-semibold">{{ 'EVENTS.CREATE.FORM.UPLOAD_CLICK' | translate }}</span> {{ 'EVENTS.CREATE.FORM.UPLOAD_DRAG' | translate }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ 'EVENTS.CREATE.FORM.UPLOAD_FORMATS' | translate }}
                  </p>
                </div>
                <input id="dropzone-file" type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*" />
              </label>
            </div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ 'EVENTS.CREATE.FORM.UPLOAD_FUTURE' | translate }}
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
                    {{ 'EVENTS.CREATE.FORM.DETECTED_MOOD' | translate }}: {{ emotionDisplayName }}
                  </h3>
                  <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                      {{ 'EVENTS.CREATE.FORM.DETECTED_MOOD_DESC' | translate }}
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
              {{ 'EVENTS.CREATE.FORM.CANCEL' | translate }}
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
              {{ 'EVENTS.CREATE.FORM.SUBMIT' | translate }}
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
  isProcessing$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private emotionService: EmotionService,
    private router: Router,
    private nlpService: NlpService,
    private translate: TranslateService,
    private faceDetectionService: FaceDetectionService
  ) {
    this.isProcessing$ = this.nlpService.isProcessing();
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      emotion: ['', Validators.required],
      theme: ['']
    });

    // Listen to content changes to detect emotion
    this.eventForm.get('content')?.valueChanges.subscribe(async content => {
      if (content && content.length > 20) {
        console.log(this.eventForm.value.content);
        await this.nlpService.processText(content);
      } else {
        this.detectedEmotion = '';
      }
    });

    // Listen to emotion selection changes
    this.eventForm.get('emotion')?.valueChanges.subscribe(emotion => {
      if (emotion) {
        this.detectedEmotion = emotion as Emotion;
        this.emotionDisplayName = this.emotionService.getEmotionDisplayName(emotion as Emotion);
        this.emotionIcon = this.emotionService.getEmotionIcon(emotion as Emotion);
      }
    });
  }

  ngOnInit() {
    // S'abonner aux réponses du service NLP
    this.nlpService.getResponse().subscribe(response => {
      if (response) {
        console.log("response: ",response);
        this.detectedEmotion = this.emotionService.detectEmotion(response);
        this.emotionDisplayName = this.emotionService.getEmotionDisplayName(this.detectedEmotion);
        this.emotionIcon = this.emotionService.getEmotionIcon(this.detectedEmotion);
      }
    });
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      return;
    }
      
    this.isSubmitting = true;
    
    this.eventForm.patchValue({
      theme: 'theme-' + this.eventForm.value.emotion
    });
    
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

  private getDominantEmotion(expressions: FaceExpressions | undefined): string {
    if (!expressions) return 'neutral';
    
    const emotions = Object.entries(expressions) as [string, number][];
    const dominantEmotion = emotions.reduce((prev, current) => {
      return (prev[1] > current[1]) ? prev : current;
    });
    
    return dominantEmotion[0];
  }

  private convertFaceApiEmotion(faceApiEmotion: string): string {
    switch (faceApiEmotion) {
      case 'angry':
        return 'anger';
      case 'disgusted':
        return 'disgust';
      case 'fearful':
        return 'fear';
      case 'happy':
        return 'joy';
      case 'neutral':
        return 'neutral';
      case 'sad':
        return 'sadness';
      case 'surprised':
        return 'fear';
      default:
        return 'neutral';
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Créer une image
      const img = new Image();
      
      // Attendre que l'image soit chargée
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      // Créer un canvas avec des dimensions fixes
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Définir les dimensions du canvas à 256x256 (taille requise par face-api.js)
      canvas.width = 256;
      canvas.height = 256;
      
      // Calculer les dimensions pour garder le ratio
      let drawWidth = 256;
      let drawHeight = 256;
      let offsetX = 0;
      let offsetY = 0;
      
      const ratio = img.width / img.height;
      if (ratio > 1) {
        // Image plus large que haute
        drawHeight = 256 / ratio;
        offsetY = (256 - drawHeight) / 2;
      } else {
        // Image plus haute que large
        drawWidth = 256 * ratio;
        offsetX = (256 - drawWidth) / 2;
      }
      
      // Dessiner l'image sur le canvas
      ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      try {
        // Détecter le visage
        const result = await this.faceDetectionService.detectSingleFace(canvas);
        console.log('Face detection result:', result?.expressions);
        
        // Récupérer l'émotion dominante
        const dominantEmotion = this.getDominantEmotion(result?.expressions);
        console.log('Dominant emotion:', dominantEmotion);
        
        // Convertir et mettre à jour l'émotion dans le formulaire
        const convertedEmotion = this.convertFaceApiEmotion(dominantEmotion);
        this.eventForm.patchValue({
          emotion: convertedEmotion
        });
        
        // Nettoyer
        URL.revokeObjectURL(img.src);
      } catch (error) {
        console.error('Error detecting face:', error);
      }
    }
  }
}