import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-the-end-logo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './the-end-logo.component.html',
  styleUrls: ['./the-end-logo.component.scss']
})
export class TheEndLogoComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() withLink = true;
  @Input() className = '';

  get sizeClasses(): string {
    const sizes = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-4xl'
    };
    return sizes[this.size];
  }

  get suffixSizeClasses(): string {
    const suffixSizes = {
      sm: 'text-[0.5rem] -top-0.5 -right-2',
      md: 'text-xs -top-1 -right-3',
      lg: 'text-sm -top-1.5 -right-4'
    };
    return suffixSizes[this.size];
  }
}