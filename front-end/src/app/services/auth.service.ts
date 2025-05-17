import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // In a real application, this would make an HTTP request to your backend
  login(email: string, password: string): Observable<User> {
    // Mock login for demonstration
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    };

    // Simulate API delay
    return of(mockUser).pipe(
      delay(800),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  // In a real application, this would make an HTTP request to your backend
  register(name: string, email: string, password: string): Observable<User> {
    // Mock registration for demonstration
    const mockUser: User = {
      id: '1',
      name: name,
      email: email,
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
    };

    // Simulate API delay
    return of(mockUser).pipe(
      delay(1000),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}