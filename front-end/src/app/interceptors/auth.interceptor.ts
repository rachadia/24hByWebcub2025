import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  console.log('Interceptor called for URL:', request.url);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  console.log('Current user from localStorage:', currentUser);
  
  if (currentUser && currentUser.token) {
    console.log('Adding Bearer token to request');
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token}`
      }
    });
  } else {
    console.log('No token found, proceeding without Authorization header');
  }

  return next(request);
}; 