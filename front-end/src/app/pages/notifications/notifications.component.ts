import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mx-auto max-w-7xl">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <button
          *ngIf="hasUnread"
          (click)="markAllAsRead()"
          class="inline-flex items-center rounded-md border border-transparent bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
        >
          Mark all as read
        </button>
      </div>

      <div class="overflow-hidden rounded-lg bg-white shadow-elevation-1 dark:bg-gray-800">
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
          <li *ngFor="let notification of notifications" 
              [ngClass]="{'bg-primary-50 dark:bg-primary-900/10': !notification.read}"
              class="relative p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <span
                  class="inline-flex h-8 w-8 items-center justify-center rounded-full"
                  [ngClass]="{
                    'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300': notification.type === 'system',
                    'bg-joy-100 text-joy-800 dark:bg-joy-900 dark:text-joy-300': notification.type === 'like',
                    'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300': notification.type === 'comment',
                  }"
                >
                  <span *ngIf="notification.type === 'system'">📢</span>
                  <span *ngIf="notification.type === 'like'">❤️</span>
                  <span *ngIf="notification.type === 'comment'">💬</span>
                  <span *ngIf="notification.type === 'follow'">👥</span>
                </span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {{ notification.message }}
                </p>
                <p class="truncate text-sm text-gray-500 dark:text-gray-400">
                  {{ notification.createdAt | date:'medium' }}
                </p>
              </div>
              <div>
                <a
                  *ngIf="notification.relatedId"
                  [routerLink]="['/events', notification.relatedId]"
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  View
                </a>
                <button
                  *ngIf="!notification.read"
                  (click)="markAsRead(notification.id)"
                  class="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Mark read
                </button>
              </div>
            </div>
          </li>

          <!-- Empty state -->
          <li *ngIf="notifications.length === 0" class="p-4 text-center">
            <p class="text-gray-500 dark:text-gray-400">No notifications yet.</p>
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  hasUnread = false;
  isLoading = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: notifications => {
        this.notifications = notifications;
        this.hasUnread = notifications.some(n => !n.read);
        this.isLoading = false;
      },
      error: error => {
        console.error('Error loading notifications:', error);
        this.isLoading = false;
      }
    });
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          notification.read = true;
        }
        this.hasUnread = this.notifications.some(n => !n.read);
      },
      error: error => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(notification => {
          notification.read = true;
        });
        this.hasUnread = false;
      },
      error: error => {
        console.error('Error marking all notifications as read:', error);
      }
    });
  }
}