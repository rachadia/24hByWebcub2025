import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        console.log('Login response:', response);
        const userWithToken = {
          ...response.user,
          token: response.token
        };
        localStorage.setItem('currentUser', JSON.stringify(userWithToken));
        this.currentUserSubject.next(userWithToken);
      }),
      map(response => response.user)
    );
  }

  register(first_name: string, last_name: string, username: string, email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { first_name, last_name, username, email, password }).pipe(
      tap(response => {
        const userWithToken = {
          ...response.user,
          token: response.token
        };
        console.log('Storing user with token:', userWithToken);
        localStorage.setItem('currentUser', JSON.stringify(userWithToken));
        this.currentUserSubject.next(userWithToken);
      }),
      map(response => response.user)
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