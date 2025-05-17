export type NotificationType = 'comment' | 'like' | 'follow' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  relatedId: string | null;
  createdAt: Date;
  read: boolean;
}