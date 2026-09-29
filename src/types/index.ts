export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DailyWorkStatus {
  id: string;
  date: string; // YYYY-MM-DD
  statusText: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'todo_created' | 'todo_completed' | 'status_logged' | 'login';
  description: string;
  timestamp: string; // ISO string
}
