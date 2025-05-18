export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profileImage?: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
  token?: string;
}