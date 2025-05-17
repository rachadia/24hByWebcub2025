import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Event } from '../models/event.model';
import { EmotionService } from './emotion.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [];
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor(private emotionService: EmotionService) {
    // Initialize with mock data for development
    this.initMockEvents();
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
    return of(this.events).pipe(delay(500));
  }

  getEventById(id: string): Observable<Event | undefined> {
    return of(this.events.find(event => event.id === id)).pipe(delay(300));
  }

  createEvent(eventData: Partial<Event>): Observable<Event> {
    const emotion = this.emotionService.detectEmotion(eventData.content || '');
    
    const newEvent: Event = {
      id: Date.now().toString(),
      userId: '1', // Would come from auth service in a real app
      title: eventData.title || '',
      content: eventData.content || '',
      createdAt: new Date(),
      emotion: emotion,
      theme: `theme-${emotion}`,
      attachments: eventData.attachments || [],
      comments: [],
      likes: 0
    };

    this.events.unshift(newEvent);
    this.eventsSubject.next([...this.events]);
    
    return of(newEvent).pipe(delay(500));
  }

  updateEvent(id: string, eventData: Partial<Event>): Observable<Event> {
    const index = this.events.findIndex(event => event.id === id);
    
    if (index === -1) {
      throw new Error('Event not found');
    }

    // If content changed, re-detect emotion
    let emotion = this.events[index].emotion;
    if (eventData.content && eventData.content !== this.events[index].content) {
      emotion = this.emotionService.detectEmotion(eventData.content);
    }

    const updatedEvent: Event = {
      ...this.events[index],
      ...eventData,
      emotion: emotion,
      theme: `theme-${emotion}`
    };

    this.events[index] = updatedEvent;
    this.eventsSubject.next([...this.events]);
    
    return of(updatedEvent).pipe(delay(500));
  }

  deleteEvent(id: string): Observable<boolean> {
    const index = this.events.findIndex(event => event.id === id);
    
    if (index === -1) {
      return of(false);
    }

    this.events.splice(index, 1);
    this.eventsSubject.next([...this.events]);
    
    return of(true).pipe(delay(500));
  }

  addComment(eventId: string, userId: string, username: string, content: string): Observable<Event> {
    const event = this.events.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    const newComment = {
      id: Date.now().toString(),
      userId,
      username,
      content,
      createdAt: new Date()
    };

    event.comments.push(newComment);
    this.eventsSubject.next([...this.events]);
    
    return of(event).pipe(delay(300));
  }

  toggleLike(eventId: string): Observable<Event> {
    const event = this.events.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    // In a real app, you'd track which users have liked which events
    // For demo purposes, we'll just increment/decrement
    event.likes += 1;
    this.eventsSubject.next([...this.events]);
    
    return of(event).pipe(delay(300));
  }

  getEventsByEmotion(emotion: string): Observable<Event[]> {
    return of(this.events.filter(event => event.emotion === emotion)).pipe(delay(500));
  }
}