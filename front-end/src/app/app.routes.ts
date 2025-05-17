import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { TEST_ROUTES } from './pages/test/test.routes';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
      },
    ]
  },
  {
    path: 'events',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/events/event-list/event-list.component').then(m => m.EventListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/events/event-create/event-create.component').then(m => m.EventCreateComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/events/event-detail/event-detail.component').then(m => m.EventDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./pages/events/event-edit/event-edit.component').then(m => m.EventEditComponent)
      },
    ]
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'notifications',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent)
  },
  {
    path: 'test',
    children: TEST_ROUTES
  },
  {
    path: 'test/theme-demo',
    loadComponent: () => import('./pages/test/theme-demo/theme-demo.component').then(m => m.ThemeDemoComponent)
  },
  { 
    path: '**', 
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) 
  }
];