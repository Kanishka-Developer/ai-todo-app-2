<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    let selectedCategory = 'all';
    let selectedPriority = 'all';
    let sortBy = 'createdAt';
    
    const categories = ['all', 'personal', 'work', 'shopping', 'health'];
    const priorities = ['all', 'high', 'medium', 'low'];
    const sortOptions = [
      { value: 'createdAt', label: 'Date Created' },
      { value: 'dueDate', label: 'Due Date' },
      { value: 'priority', label: 'Priority' }
    ];
    
    $: {
      dispatch('filter', {
        category: selectedCategory,
        priority: selectedPriority,
        sortBy
      });
    }
  </script>
  
  <div class="flex gap-4 mb-4 p-4 bg-gray-100 rounded">
    <select
      bind:value={selectedCategory}
      class="p-2 rounded border"
    >
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
    
    <select
      bind:value={selectedPriority}
      class="p-2 rounded border"
    >
      {#each priorities as priority}
        <option value={priority}>{priority}</option>
      {/each}
    </select>
    
    <select
      bind:value={sortBy}
      class="p-2 rounded border"
    >
      {#each sortOptions as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>