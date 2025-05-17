import { Routes } from '@angular/router';
import { THEME_DEMO_ROUTES } from './theme-demo/theme-demo.routes';

export const TEST_ROUTES: Routes = [
  {
    path: 'theme-demo',
    children: THEME_DEMO_ROUTES
  }
]; 