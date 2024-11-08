import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { v4 as uuid } from 'uuid';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  steps: string[];
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate?: string;
}

function createTodoStore() {
  // Load initial todos from localStorage
  const initialTodos = browser 
    ? JSON.parse(localStorage.getItem('todos') || '[]') 
    : [];

  const { subscribe, set, update } = writable<Todo[]>(initialTodos);

  // Helper to persist todos to localStorage
  const persistTodos = (todos: Todo[]) => {
    if (browser) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  };

  return {
    subscribe,
    add: (text: string, steps: string[] = [], category: string = 'personal', priority: 'medium' = 'medium', dueDate?: string) => {
      update(todos => {
        const newTodos = [...todos, {
          id: uuid(),
          text,
          completed: false,
          steps,
          category,
          priority,
          createdAt: new Date().toISOString(),
          dueDate
        }];
        persistTodos(newTodos);
        return newTodos;
      });
    },
    toggle: (id: string) => {
      update(todos => {
        const newTodos = todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        persistTodos(newTodos);
        return newTodos;
      });
    },
    delete: (id: string) => {
      update(todos => {
        const newTodos = todos.filter(todo => todo.id !== id);
        persistTodos(newTodos);
        return newTodos;
      });
    },
    reorder: (newTodos: Todo[]) => {
      persistTodos(newTodos);
      set(newTodos);
    }
  };
}

export const todos = createTodoStore();