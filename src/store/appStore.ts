import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Todo, DailyWorkStatus, Activity, Status } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';

interface AppState {
  todos: Todo[];
  dailyStatuses: DailyWorkStatus[];
  activities: Activity[];
  
  // Actions
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  addDailyStatus: (statusText: string) => void;
  
  // Helpers
  checkOverdueTasks: () => void;
}

// Dummy data for testing
const initialTodos: Todo[] = [
  {
    id: uuidv4(),
    title: 'Design Dashboard UI',
    description: 'Create modern dashboard wireframes in Figma',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Implement Authentication',
    description: 'Add JWT based authentication',
    priority: 'Critical',
    status: 'Completed',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Setup CI/CD Pipeline',
    description: 'Configure GitHub Actions for deployment',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // Overdue
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
  },
];

const initialActivities: Activity[] = [
  {
    id: uuidv4(),
    type: 'todo_completed',
    description: 'Completed "Implement Authentication"',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: uuidv4(),
    type: 'todo_created',
    description: 'Created "Design Dashboard UI"',
    timestamp: new Date().toISOString(),
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      todos: initialTodos,
      dailyStatuses: [],
      activities: initialActivities,
      
      addTodo: (todo) => {
        const newTodo: Todo = {
          ...todo,
          id: uuidv4(),
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const newActivity: Activity = {
          id: uuidv4(),
          type: 'todo_created',
          description: `Created task "${todo.title}"`,
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          todos: [...state.todos, newTodo],
          activities: [newActivity, ...state.activities].slice(0, 50),
        }));
      },
      
      updateTodo: (id, updates) => {
        set((state) => {
          const updatedTodos = state.todos.map((todo) => {
            if (todo.id === id) {
              const updated = { ...todo, ...updates, updatedAt: new Date().toISOString() };
              
              if (todo.status !== 'Completed' && updates.status === 'Completed') {
                const activity: Activity = {
                  id: uuidv4(),
                  type: 'todo_completed',
                  description: `Completed task "${todo.title}"`,
                  timestamp: new Date().toISOString(),
                };
                state.activities = [activity, ...state.activities].slice(0, 50);
              }
              return updated;
            }
            return todo;
          });
          return { todos: updatedTodos };
        });
      },
      
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        }));
      },
      
      addDailyStatus: (statusText) => {
        const status: DailyWorkStatus = {
          id: uuidv4(),
          date: format(new Date(), 'yyyy-MM-dd'),
          statusText,
          createdAt: new Date().toISOString(),
        };
        
        const activity: Activity = {
          id: uuidv4(),
          type: 'status_logged',
          description: 'Logged daily status',
          timestamp: new Date().toISOString(),
        };
        
        set((state) => {
          // Remove existing status for today if any
          const filteredStatuses = state.dailyStatuses.filter(
            (s) => s.date !== status.date
          );
          
          return {
            dailyStatuses: [status, ...filteredStatuses],
            activities: [activity, ...state.activities].slice(0, 50),
          };
        });
      },
      
      checkOverdueTasks: () => {
        const today = startOfDay(new Date());
        let changed = false;
        
        const updatedTodos = get().todos.map((todo) => {
          if (todo.status !== 'Completed' && todo.status !== 'Overdue') {
            const dueDate = startOfDay(parseISO(todo.dueDate));
            if (isBefore(dueDate, today)) {
              changed = true;
              return { ...todo, status: 'Overdue' as Status };
            }
          }
          return todo;
        });
        
        if (changed) {
          set({ todos: updatedTodos });
        }
      },
    }),
    {
      name: 'app-storage',
    }
  )
);
