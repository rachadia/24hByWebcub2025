import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-the-end-logo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <ng-container *ngIf="withLink; else logoOnly">
      <a [routerLink]="['/']" class="flex items-center gap-2">
        <ng-container *ngTemplateOutlet="logoContent"></ng-container>
      </a>
    </ng-container>
    
    <ng-template #logoOnly>
      <ng-container *ngTemplateOutlet="logoContent"></ng-container>
    </ng-template>

    <ng-template #logoContent>
      <div class="logo-container {{ className }}">
        <span class="logo-text {{ sizeClass }}">TheEnd</span>
        <span class="logo-suffix {{ suffixSizeClass }}">.page</span>
      </div>
    </ng-template>
  `,
  styles: [`
    @keyframes neon-pulse {
      0%, 100% {
        filter: drop-shadow(0 0 2px rgba(255, 31, 117, 0.4));
      }
      50% {
        filter: drop-shadow(0 0 5px rgba(255, 31, 117, 0.7));
      }
    }

    .logo-container {
      position: relative;
      display: inline-flex;
      align-items: center;
    }
    
    .logo-text {
      font-weight: 700;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      background-image: linear-gradient(to right, var(--endpage-pink, #ff1f75), var(--endpage-purple, #9c4dff));
      text-shadow: 0 0 0.1px rgba(255, 31, 117, 0.7), 0 0 20px rgba(255, 31, 117, 0.4);
      animation: neon-pulse 3s infinite;
      letter-spacing: -0.02em;
    }
    
    .logo-suffix {
      position: absolute;
      color: var(--endpage-pink, #ff1f75);
      font-weight: 600;
      filter: drop-shadow(0 0 3px rgba(255, 31, 117, 0.7));
    }
    
    /* Tailles */
    .text-lg {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
    
    .text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    
    .text-4xl {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }
    
    .suffix-sm {
      font-size: 0.5rem;
      top: -0.125rem;
      right: -0.5rem;
    }
    
    .suffix-md {
      font-size: 0.75rem;
      top: -0.25rem;
      right: -0.75rem;
    }
    
    .suffix-lg {
      font-size: 0.875rem;
      top: -0.375rem;
      right: -1rem;
    }
  `]
})
export class TheEndLogoComponent implements OnInit {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() withLink: boolean = true;
  @Input() className: string = '';
  
  ngOnInit(): void {
    // S'assurer que les polices sont chargées pour un meilleur rendu
    this.loadFonts();
  }

  private loadFonts(): void {
    // Charger SpaceGrotesk si ce n'est pas déjà fait
    if (!document.getElementById('space-grotesk-font')) {
      const link = document.createElement('link');
      link.id = 'space-grotesk-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }
  
  get sizeClass(): string {
    const sizeClasses = {
      'sm': 'text-lg',
      'md': 'text-2xl',
      'lg': 'text-4xl'
    };
    return sizeClasses[this.size] || 'text-2xl';
  }
  
  get suffixSizeClass(): string {
    const suffixSizeClasses = {
      'sm': 'suffix-sm',
      'md': 'suffix-md',
      'lg': 'suffix-lg'
    };
    return suffixSizeClasses[this.size] || 'suffix-md';
  }
}