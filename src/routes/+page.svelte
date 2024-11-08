<script lang="ts">
  import TodoForm from '$lib/components/TodoForm.svelte';
  import TodoList from '$lib/components/TodoList.svelte';
  import TodoFilters from '$lib/components/TodoFilters.svelte';
  import ProductivityInsights from '$lib/components/ProductivityInsights.svelte';
  import { todos } from '$lib/stores/todoStore';
  
  let showInsights = false;
  let filteredTodos = [];
  
  function handleFilter(event: CustomEvent) {
    const { category, priority, sortBy } = event.detail;
    
    filteredTodos = $todos
      .filter(todo => 
        (category === 'all' || todo.category === category) &&
        (priority === 'all' || todo.priority === priority)
      )
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
      });
  }

  // Update filteredTodos whenever the store changes
  $: if ($todos) {
    handleFilter({ detail: { category: 'all', priority: 'all', sortBy: 'createdAt' } });
  }
</script>

<div class="max-w-4xl mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">AI-Powered Todo List</h1>
    <button
      on:click={() => showInsights = !showInsights}
      class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
    >
      {showInsights ? 'Hide' : 'Show'} Insights
    </button>
  </div>
  
  {#if showInsights}
    <ProductivityInsights />
  {/if}
  
  <TodoForm />
  <TodoFilters on:filter={handleFilter} />
  <TodoList todos={filteredTodos} />
</div>