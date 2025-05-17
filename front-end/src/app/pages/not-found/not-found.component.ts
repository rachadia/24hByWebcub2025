import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div class="mb-4 text-6xl">😕</div>
      <h1 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
      <p class="mb-8 text-lg text-gray-600 dark:text-gray-400">
        We can't seem to find the page you're looking for.
      </p>
      <a
        routerLink="/"
        class="rounded-md bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
      >
        Go back home
      </a>
    </div>
  `,
})
export class NotFoundComponent {}