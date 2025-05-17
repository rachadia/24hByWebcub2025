export interface Event {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  emotion: string;
  theme: string;
  attachments: string[];
  comments: Comment[];
  likes: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}