import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ThemeService } from '../../services/theme.service';
import { User } from '../../models/user.model';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { TheEndLogoComponent } from '../the-end-logo/the-end-logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent, TranslateModule, TheEndLogoComponent],
  template: `
    <header class="bg-white shadow transition-colors dark:bg-gray-800">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <div class="flex items-center">
          <app-the-end-logo size="md"></app-the-end-logo>
        </div>
        <!-- Navigation -->
        <nav class="hidden space-x-8 md:flex">
          <a
            routerLink="/"
            routerLinkActive="text-primary-600 dark:text-primary-400"
            [routerLinkActiveOptions]="{exact: true}"
            class="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
          >
            {{ 'NAVIGATION.HOME' | translate }}
          </a>
          <a
            *ngIf="isLoggedIn"
            routerLink="/events"
            routerLinkActive="text-primary-600 dark:text-primary-400"
            class="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
          >
            {{ 'NAVIGATION.EVENTS' | translate }}
          </a>
        </nav>

        <!-- Right section -->
        <div class="flex items-center space-x-4">
          <!-- Language selector -->
          <app-language-selector></app-language-selector>

          <!-- Dark mode toggle -->
          <button
            (click)="toggleDarkMode()"
            class="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <span *ngIf="isDarkMode" class="text-xl">🌞</span>
            <span *ngIf="!isDarkMode" class="text-xl">🌙</span>
          </button>

          <!-- Not logged in -->
          <div *ngIf="!isLoggedIn" class="flex items-center space-x-2">
            <a
              routerLink="/auth/login"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {{ 'AUTH.LOGIN' | translate }}
            </a>
            <a
              routerLink="/auth/register"
              class="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              {{ 'AUTH.REGISTER' | translate }}
            </a>
          </div>

          <!-- Logged in -->
          <div *ngIf="isLoggedIn" class="flex items-center space-x-4">
            <!-- Notifications -->
            <!--<div class="relative">
              <a
                routerLink="/notifications"
                class="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              >
                <span class="text-xl">🔔</span>
                <span
                  *ngIf="unreadCount > 0"
                  class="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  {{ unreadCount }}
                </span>
              </a>
            </div>-->

            <!-- Create new event button -->
            <a
              routerLink="/events/new"
              class="hidden rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 sm:inline-block"
            >
              {{ 'EVENTS.NEW' | translate }}
            </a>

            <!-- User menu -->
            <div class="relative" (click)="toggleUserMenu()" [attr.aria-expanded]="isUserMenuOpen">
              <button
                type="button"
                class="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <img
                  *ngIf="currentUser?.profileImage"
                  [src]="currentUser?.profileImage"
                  alt="Profile"
                  class="h-8 w-8 rounded-full"
                />
                <div
                  *ngIf="!currentUser?.profileImage"
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                >
                  {{ currentUser?.username?.charAt(0) || 'U' }}
                </div>
              </button>

              <!-- Dropdown menu -->
              <div
                *ngIf="isUserMenuOpen"
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700"
              >
                <a
                  routerLink="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {{ 'PROFILE.TITLE' | translate }}
                </a>
                <a
                  routerLink="/events"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {{ 'EVENTS.MY_EVENTS' | translate }}
                </a>
                <a
                  (click)="logout(); $event.preventDefault()"
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {{ 'AUTH.LOGOUT' | translate }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;
  unreadCount = 0;
  isUserMenuOpen = false;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });

    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });

    this.isDarkMode = this.themeService.isDarkMode();

    // Close menu when clicking outside
    document.addEventListener('click', this.closeMenuOnOutsideClick.bind(this));
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeMenuOnOutsideClick(event: MouseEvent): void {
    // Only close if menu is open and click is outside menu
    if (this.isUserMenuOpen && !(event.target as HTMLElement).closest('.relative')) {
      this.isUserMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.router.navigateByUrl('/');
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  setTheme(emotion: string): void {
    this.themeService.setTheme(emotion);
    this.isDarkMode = this.themeService.isDarkMode();
  }
}