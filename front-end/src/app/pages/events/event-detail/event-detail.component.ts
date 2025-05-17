import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { Event, Comment } from '../../../models/event.model';
import { User } from '../../../models/user.model';
import { EmotionService } from '../../../services/emotion.service';
import { THEMES } from '../../../utils/theme-utils';
import { appliquerTheme } from '../../../utils/theme-utils';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="mx-auto max-w-4xl">
      <div class="mb-6 flex items-center justify-between">
        <a
          routerLink="/events"
          class="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span class="mr-1">←</span>
          Back to Events
        </a>
        <div class="flex space-x-3">
          <a
            *ngIf="currentUser && event?.userId === currentUser.id"
            [routerLink]="['/events', event?.id, 'edit']"
            class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Edit Event
          </a>
          <button
            *ngIf="currentUser && event?.userId === currentUser.id"
            (click)="deleteEvent()"
            class="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-200 dark:hover:bg-red-900/30"
          >
            Delete
          </button>
        </div>
      </div>

      <div *ngIf="isLoading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>

      <div *ngIf="!isLoading && event" [ngClass]="event.theme">
        <!-- Event header -->
        <div class="mb-6 rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ event.title }}</h1>
              <div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{{ event.createdAt | date:'medium' }}</span>
                <span class="mx-2">•</span>
                <span 
                  [ngClass]="{
                    'text-joy-600 dark:text-joy-400': event.emotion === 'joy',
                    'text-sadness-600 dark:text-sadness-400': event.emotion === 'sadness',
                    'text-anger-600 dark:text-anger-400': event.emotion === 'anger',
                    'text-fear-600 dark:text-fear-400': event.emotion === 'fear',
                  }"
                >
                  {{ getEmotionIcon(event.emotion) }} {{ getEmotionDisplayName(event.emotion) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Event content -->
          <div class="prose prose-lg max-w-none dark:prose-invert">
            <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ event.content }}</p>
          </div>

          <!-- Event attachments -->
          <div *ngIf="event.attachments && event.attachments.length > 0" class="mt-6">
            <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Attachments</h3>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div *ngFor="let attachment of event.attachments" class="overflow-hidden rounded-lg">
                <img
                  [src]="attachment"
                  alt="Attachment"
                  class="h-48 w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Event actions -->
        <div class="mb-6 rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button
                (click)="likeEvent()"
                class="flex items-center space-x-1 rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <span>❤️</span>
                <span>{{ event.likes }} Likes</span>
              </button>
              <button
                (click)="scrollToComments()"
                class="flex items-center space-x-1 rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <span>💬</span>
                <span>{{ event.comments.length }} Comments</span>
              </button>
            </div>
            <button
              class="rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span>🔗 Share</span>
            </button>
          </div>
        </div>

        <!-- Comments section -->
        <div class="rounded-lg bg-white p-6 shadow-elevation-1 dark:bg-gray-800" id="comments">
          <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Comments</h2>

          <!-- Comment form -->
          <div *ngIf="currentUser" class="mb-6">
            <div class="flex space-x-3">
              <div class="avatar">
                <img
                  *ngIf="currentUser.profileImage"
                  [src]="currentUser.profileImage"
                  alt="Your profile image"
                  class="h-full w-full object-cover"
                />
                <span *ngIf="!currentUser.profileImage">{{ currentUser.name.charAt(0) }}</span>
              </div>
              <div class="flex-1">
                <form (ngSubmit)="addComment()">
                  <textarea
                    [(ngModel)]="newComment"
                    name="comment"
                    rows="3"
                    class="textarea"
                    placeholder="Write a comment..."
                  ></textarea>
                  <div class="mt-2 flex justify-end">
                    <button
                      type="submit"
                      [disabled]="!newComment.trim()"
                      class="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-primary-700 dark:hover:bg-primary-600"
                    >
                      Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Comments list -->
          <div class="space-y-4">
            <div *ngFor="let comment of event.comments" class="flex space-x-3">
              <div class="avatar">
                <span>{{ comment.username.charAt(0) }}</span>
              </div>
              <div class="flex-1 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <div class="mb-1 flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ comment.username }}</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ comment.createdAt | date:'medium' }}</p>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ comment.content }}</p>
              </div>
            </div>

            <!-- No comments state -->
            <div *ngIf="event.comments.length === 0" class="py-4 text-center">
              <p class="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
            </div>
          </div>
        </div>
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
export class EventDetailComponent implements OnInit {
  event: Event | undefined;
  isLoading = true;
  currentUser: User | null = null;
  newComment = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private emotionService: EmotionService,

    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
      this.switchTheme(this.event?.emotion || '');
    }
  }

  loadEvent(id: string): void {
    this.eventService.getEventById(id).subscribe({
      next: event => {
        this.event = event;
        this.isLoading = false;
        console.log(this.event);
        switch (this.event?.emotion) {
          case 'joy':
            this.themeService.setTheme('joy');
            break;
          case 'sadness':
            this.themeService.setTheme('sadness');
            break;
        }
        
      },
      error: error => {
        console.error('Error loading event:', error);
        this.isLoading = false;
      }
    });
  }

  likeEvent(): void {
    if (!this.event) return;
    this.eventService.toggleLike(this.event.id).subscribe({
      next: updatedEvent => {
        this.event = updatedEvent;
      },
      error: error => {
        console.error('Error liking event:', error);
      }
    });
  }

  addComment(): void {
    if (!this.event || !this.currentUser || !this.newComment.trim()) return;

    this.eventService
      .addComment(this.event.id, this.currentUser.id, this.currentUser.name, this.newComment.trim())
      .subscribe({
        next: updatedEvent => {
          this.event = updatedEvent;
          this.newComment = '';
        },
        error: error => {
          console.error('Error adding comment:', error);
        }
      });
  }

  deleteEvent(): void {
    if (!this.event) return;

    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      this.eventService.deleteEvent(this.event.id).subscribe({
        next: success => {
          if (success) {
            this.router.navigate(['/events']);
          }
        },
        error: error => {
          console.error('Error deleting event:', error);
        }
      });
    }
  }

  scrollToComments(): void {
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
  }

  getEmotionDisplayName(emotion: string): string {
    return this.emotionService.getEmotionDisplayName(emotion as any);
  }

  getEmotionIcon(emotion: string): string {
    return this.emotionService.getEmotionIcon(emotion as any);
  }

  switchTheme(theme: string): void {
    
    switch (theme) {
      case 'joy':
        appliquerTheme(THEMES.INTENSITY);
        break;
      case 'sadness':
        //this.themeSubject.next('sadness');
        appliquerTheme(THEMES.LIGHT_MELANCHOLY);
        break;
      case 'anger':
        //this.themeSubject.next('anger');
        appliquerTheme(THEMES.DARK_PASSION);
        break;
    default:
      break;
  }
}
}