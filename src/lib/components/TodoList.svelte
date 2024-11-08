<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';
  import TodoItem from './TodoItem.svelte';
  import type { Todo } from '$lib/stores/todoStore';
  import { todos } from '$lib/stores/todoStore';

  // Get todos from store
  $: allTodos = $todos;
  
  function handleDndConsider(e: CustomEvent<{items: Todo[]}>) {
    todos.reorder(e.detail.items);
  }
  
  function handleDndFinalize(e: CustomEvent<{items: Todo[]}>) {
    todos.reorder(e.detail.items);
  }

  // Group todos by category
  $: groupedTodos = allTodos.reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = [];
    }
    acc[todo.category].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  const priorityColors = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-green-500'
  };
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
        <div class="transform transition-transform duration-200 hover:-translate-y-1 cursor-move">
          <div class={`border-l-4 ${priorityColors[todo.priority]} bg-white rounded-lg shadow`}>
            <TodoItem {todo} />
          </div>
        </div>
      {/each}
    </div>
  </div>
{/each}

{#if allTodos.length === 0}
  <div class="text-center py-8 text-gray-500">
    <p>No todos yet. Add some tasks to get started!</p>
  </div>
{/if}