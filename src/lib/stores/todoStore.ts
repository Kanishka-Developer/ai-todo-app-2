import { writable } from 'svelte/store';
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

const storedTodos = browser ? localStorage.getItem('todos') : null;
const initialTodos: Todo[] = storedTodos ? JSON.parse(storedTodos) : [];

function createTodoStore() {
  const { subscribe, set, update } = writable<Todo[]>(initialTodos);

  const updateAndStore = (newTodos: Todo[]) => {
    if (browser) {
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }
    return newTodos;
  };

  return {
    subscribe,
    add: (text: string, steps: string[] = [], category: string = 'personal', priority: 'medium' = 'medium') => {
      update(todos => updateAndStore([...todos, {
        id: uuid(),
        text,
        completed: false,
        steps,
        category,
        priority,
        createdAt: new Date().toISOString(),
      }]));
    },
    toggle: (id: string) => {
      update(todos => updateAndStore(
        todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      ));
    },
    delete: (id: string) => {
      update(todos => updateAndStore(
        todos.filter(todo => todo.id !== id)
      ));
    },
    addSteps: (id: string, steps: string[]) => {
      update(todos => updateAndStore(
        todos.map(todo =>
          todo.id === id ? { ...todo, steps } : todo
        )
      ));
    },
    reorder: (newTodos: Todo[]) => {
      update(() => updateAndStore(newTodos));
    },
    updateDueDate: (id: string, dueDate: string) => {
      update(todos => updateAndStore(
        todos.map(todo =>
          todo.id === id ? { ...todo, dueDate } : todo
        )
      ));
    }
  };
}

export const todos = createTodoStore();