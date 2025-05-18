import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, mergeMap, catchError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Event } from '../models/event.model';
import { EmotionService } from './emotion.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
 
  private apiUrl = `${environment.apiUrl}/events`;
  private events: Event[] = [];
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient, private emotionService: EmotionService) {
    // Initialize with mock data for development
  }

  private getHeaders(): HttpHeaders {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.token) {
      return new HttpHeaders().set('Authorization', `Bearer ${currentUser.token}`);
    }
    return new HttpHeaders();
  }

  private initMockEvents() {
    this.events = [
      {
        id: '1',
        userId: '1',
        title: 'Landed My Dream Job!',
        content: "After months of interviews, I finally got an offer from my dream company! So excited to start this new chapter!",
        createdAt: new Date(2023, 3, 15),
        emotion: 'joy',
        theme: 'theme-joy',
        attachments: [],
        comments: [
          {
            id: '1',
            userId: '2',
            username: 'Jane Smith',
            content: 'Congratulations! So happy for you!',
            createdAt: new Date(2023, 3, 15, 14, 30)
          }
        ],
        likes: 5
      },
      {
        id: '2',
        userId: '1',
        title: 'Lost a Friend Today',
        content: "My childhood friend moved to another country today. We've been friends for over 20 years. I know we'll stay in touch, but it won't be the same.",
        createdAt: new Date(2023, 2, 28),
        emotion: 'sadness',
        theme: 'theme-sadness',
        attachments: ['https://images.pexels.com/photos/397096/pexels-photo-397096.jpeg'],
        comments: [],
        likes: 3
      },
      {
        id: '3',
        userId: '1',
        title: 'Missed Flight Connection',
        content: "The airline delayed my first flight and I missed my connection. Now I'm stuck at the airport for 7 hours with no compensation!",
        createdAt: new Date(2023, 1, 12),
        emotion: 'anger',
        theme: 'theme-anger',
        attachments: [],
        comments: [],
        likes: 0
      }
    ];
    
    this.eventsSubject.next([...this.events]);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching events', error);
        return of([]);
      })
    );
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createEvent(eventData: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, eventData, { headers: this.getHeaders() });
  }

  updateEvent(id: string, eventData: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData, { headers: this.getHeaders() });
  }

  updateLike(id: string): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/${id}/likes`, {increment: true}, { headers: this.getHeaders() });
  }

  updateComment(id: string, eventData: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/${id}/comments`, eventData, { headers: this.getHeaders() });
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  addComment(eventId: string, userId: string, username: string, content: string): Observable<Event> {
    const newComment = {
      id: Date.now().toString(),
      userId,
      username,
      content,
      createdAt: new Date()
    };

    return this.getEventById(eventId).pipe(
      map(event => {
        if (!event) {
          throw new Error('Event not found');
        }
        event.comments.push(newComment);
        return this.updateComment(eventId, event).pipe(
          map(updatedEvent => {
            this.eventsSubject.next([...this.events]);
            return updatedEvent;
          })
        );
      }),
      mergeMap(obs => obs)
    );
  }

  toggleLike(eventId: string): Observable<Event> {
    return this.getEventById(eventId).pipe(
      map(event => {
        if (!event) {
          throw new Error('Event not found');
        }
        event.likes += 1;
        return this.updateLike(eventId).pipe(
          map(updatedEvent => {
            this.eventsSubject.next([...this.events]);
            return updatedEvent;
          })
        );
      }),
      mergeMap(obs => obs)
    );
  }

  getEventsByEmotion(emotion: string): Observable<Event[]> {
    return of(this.events.filter(event => event.emotion === emotion)).pipe(delay(500));
  }

  getEventsByUserId(userId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  getTopEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/podium`).pipe(
      catchError((error) => {
        console.error('Error fetching top events', error);
        return of([]);
      })
    );
  }
}