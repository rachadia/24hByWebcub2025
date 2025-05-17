import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('');
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.themeSubject.next(savedTheme);
    }
  }

  setTheme(theme: string): void {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
  }

  toggleDarkMode(): void {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    }
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}