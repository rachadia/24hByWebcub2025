import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  previewColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('');
  public theme$ = this.themeSubject.asObservable();
  
  // Les thèmes disponibles
  public availableThemes: ThemeOption[] = [
    { 
      id: 'theme-joy', 
      name: 'Mode Joyeux', 
      description: 'Un thème coloré et joyeux avec des tons roses', 
      previewColor: '#f43f5e' 
    },
    { 
      id: 'theme-sadness', 
      name: 'Mode Mélancolique', 
      description: 'Un thème aux tons bleus apaisants', 
      previewColor: '#3b82f6' 
    },
    { 
      id: 'theme-anger', 
      name: 'Mode Passion', 
      description: 'Un thème aux couleurs chaudes et vibrantes', 
      previewColor: '#ef4444' 
    },
    { 
      id: 'theme-neutre', 
      name: 'Mode Neutre', 
      description: 'Un thème équilibré et épuré', 
      previewColor: '#6b7280' 
    },
    { 
      id: 'theme-intensity', 
      name: 'Mode Intensité', 
      description: 'Un thème énergique et vibrant, sans être extrême',
      previewColor: '#8b5cf6' 
    }
  ];

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