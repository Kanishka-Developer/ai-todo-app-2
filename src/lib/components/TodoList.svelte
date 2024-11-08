<script lang="ts">
    import { dndzone } from 'svelte-dnd-action';
    import TodoItem from './TodoItem.svelte';
    import type { Todo } from '$lib/stores/todoStore';
  
    export let todos: Todo[] = [];
  
    function handleDndConsider(e: CustomEvent<{items: Todo[]}>) {
      todos = e.detail.items;
    }
  
    function handleDndFinalize(e: CustomEvent<{items: Todo[]}>) {
      todos = e.detail.items;
    }
  
    // Color mapping for priorities
    const priorityColors = {
      high: 'border-red-500',
      medium: 'border-yellow-500',
      low: 'border-green-500'
    };
  
    // Group todos by category
    $: groupedTodos = todos.reduce((acc, todo) => {
      if (!acc[todo.category]) {
        acc[todo.category] = [];
      }
      acc[todo.category].push(todo);
      return acc;
    }, {} as Record<string, Todo[]>);
  </script>
  
  {#each Object.entries(groupedTodos) as [category, categoryTodos]}
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4 capitalize">{category}</h2>
      <div
        use:dndzone={{items: categoryTodos}}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
        class="space-y-3"
      >
        {#each categoryTodos as todo (todo.id)}
          <div 
            class="transform transition-transform duration-200 hover:-translate-y-1 cursor-move"
          >
            <div class={`border-l-4 ${priorityColors[todo.priority]} bg-white rounded-lg shadow`}>
              <TodoItem {todo} />
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/each}
  
  {#if todos.length === 0}
    <div class="text-center py-8 text-gray-500">
      <p>No todos yet. Add some tasks to get started!</p>
    </div>
  {/if}
  
  <style>
    /* Add smooth transitions for drag and drop */
    div {
      transition: transform 0.2s ease;
    }
  </style>