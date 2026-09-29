export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'
export type TaskStatus = 'Todo' | 'In Progress' | 'Done'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: TaskStatus
  dueDate: string
  category: string
  estimate: string
  completedAt?: string
}

export interface WorkLog {
  id: string
  date: string
  mood: number
  hours: number
  note: string
}

export interface User {
  name: string
  email: string
}
