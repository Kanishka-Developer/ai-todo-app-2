<script lang="ts">
  import { todos } from '$lib/stores/todoStore';
  
  let todoText = '';
  let selectedCategory = 'personal';
  let selectedPriority = 'medium';
  let dueDate = '';

  const categories = ['personal', 'work', 'shopping', 'health', 'study'];
  const priorities = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  async function handleSubmit() {
    if (!todoText.trim()) return;
    
    const response = await fetch('/api/suggest', {
      method: 'POST',
      body: JSON.stringify({ todo: todoText }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    const steps = await response.json();
    todos.add(todoText, steps, selectedCategory, selectedPriority);
    
    // Reset form
    todoText = '';
    selectedCategory = 'personal';
    selectedPriority = 'medium';
    dueDate = '';
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white p-6 rounded-lg shadow-md mb-8">
  <div class="space-y-4">
    <!-- Todo Text -->
    <div>
      <input
        type="text"
        bind:value={todoText}
        placeholder="Add a new todo..."
        class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Category Selection -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          bind:value={selectedCategory}
          class="w-full p-2 border rounded-lg"
        >
          {#each categories as category}
            <option value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          {/each}
        </select>
      </div>

      <!-- Priority Selection -->
      <div>
        <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          bind:value={selectedPriority}
          class="w-full p-2 border rounded-lg"
        >
          {#each priorities as priority}
            <option value={priority.value}>{priority.label}</option>
          {/each}
        </select>
      </div>

      <!-- Due Date -->
      <div>
        <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">
          Due Date (Optional)
        </label>
        <input
          type="date"
          id="dueDate"
          bind:value={dueDate}
          class="w-full p-2 border rounded-lg"
        />
      </div>
    </div>

    <button
      type="submit"
      class="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Add Todo
    </button>
  </div>
</form>