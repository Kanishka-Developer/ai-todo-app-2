<script lang="ts">
  import type { Todo } from '$lib/stores/todoStore';
  import { todos } from '$lib/stores/todoStore';
  
  export let todo: Todo;
  
  const priorityClasses = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-green-600'
  };

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }
</script>

<div class="p-4">
  <div class="flex items-center gap-3">
    <input
      type="checkbox"
      checked={todo.completed}
      on:change={() => todos.toggle(todo.id)}
      class="w-5 h-5 rounded"
    />
    
    <div class="flex-1">
      <span class="text-gray-900 {todo.completed ? 'line-through text-gray-500' : ''}">
        {todo.text}
      </span>
      
      <div class="flex gap-2 mt-1 text-sm text-gray-500">
        <span class={priorityClasses[todo.priority]}>
          {todo.priority}
        </span>
        <span>•</span>
        <span>{formatDate(todo.createdAt)}</span>
        {#if todo.dueDate}
          <span>•</span>
          <span>Due: {formatDate(todo.dueDate)}</span>
        {/if}
      </div>
    </div>

    <button
      on:click={() => todos.delete(todo.id)}
      class="text-red-500 hover:text-red-700 transition-colors"
    >
      Delete
    </button>
  </div>

  {#if todo.steps?.length > 0}
    <div class="mt-3 pl-8">
      <ul class="list-disc space-y-1 text-sm text-gray-600">
        {#each todo.steps as step}
          <li class={todo.completed ? 'line-through text-gray-400' : ''}>
            {step}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>