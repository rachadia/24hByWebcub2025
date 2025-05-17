import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ThemeLibraryService } from '../services/theme-library.service';

@Directive({
  selector: '[appThemeApply]',
  standalone: true
})
export class ThemeApplyDirective implements OnChanges {
  @Input('appThemeApply') themeId: string = '';

  constructor(
    private el: ElementRef<HTMLElement>,
    private themeLibraryService: ThemeLibraryService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['themeId'] && this.themeId) {
      this.applyTheme();
    }
  }

  private applyTheme(): void {
    this.themeLibraryService.applyTheme(this.themeId, this.el.nativeElement);
  }
} 