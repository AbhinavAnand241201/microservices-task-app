export interface User {
  _id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  userId: string;
  created_at: string;
  __v: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface TaskFormData {
  title: string;
  description: string;
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  status?: 'To Do' | 'In Progress' | 'Done';
}

export interface AuthResponse {
  message: string;
  token: string;
  user?: User;
}
