import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  private unreadCount = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCount.asObservable();

  constructor() {
    // Initialize with mock data
    this.initMockNotifications();
  }

  private initMockNotifications() {
    this.notifications = [
      {
        id: '1',
        userId: '1',
        type: 'comment',
        message: 'Jane Smith commented on your event "Landed My Dream Job!"',
        relatedId: '1',
        createdAt: new Date(2023, 3, 15, 14, 35),
        read: false
      },
      {
        id: '2',
        userId: '1',
        type: 'like',
        message: 'Alex Johnson liked your event "Lost a Friend Today"',
        relatedId: '2',
        createdAt: new Date(2023, 3, 10, 9, 20),
        read: true
      },
      {
        id: '3',
        userId: '1',
        type: 'system',
        message: 'Welcome to The End Page! Start sharing your life events.',
        relatedId: null,
        createdAt: new Date(2023, 3, 1, 12, 0),
        read: true
      }
    ];

    this.notificationsSubject.next([...this.notifications]);
    this.updateUnreadCount();
  }

  getNotifications(): Observable<Notification[]> {
    return of(this.notifications).pipe(delay(500));
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  markAsRead(id: string): Observable<boolean> {
    const notification = this.notifications.find(n => n.id === id);
    
    if (!notification) {
      return of(false);
    }

    notification.read = true;
    this.notificationsSubject.next([...this.notifications]);
    this.updateUnreadCount();
    
    return of(true).pipe(delay(300));
  }

  markAllAsRead(): Observable<boolean> {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    
    this.notificationsSubject.next([...this.notifications]);
    this.updateUnreadCount();
    
    return of(true).pipe(delay(500));
  }

  addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Observable<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    this.notifications.unshift(newNotification);
    this.notificationsSubject.next([...this.notifications]);
    this.updateUnreadCount();
    
    return of(newNotification).pipe(delay(300));
  }

  private updateUnreadCount(): void {
    const count = this.notifications.filter(n => !n.read).length;
    this.unreadCount.next(count);
  }
}