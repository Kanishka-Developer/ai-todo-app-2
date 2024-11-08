<script lang="ts">
  import { todos } from '$lib/stores/todoStore';
  
  // Calculate statistics directly from the todos store
  $: totalTodos = $todos.length;
  $: completedTodos = $todos.filter(todo => todo.completed).length;
  $: completionRate = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
  
  // Calculate category statistics
  $: categoryStats = $todos.reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = { total: 0, completed: 0 };
    }
    acc[todo.category].total += 1;
    if (todo.completed) {
      acc[todo.category].completed += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);
  
  $: mostProductiveCategory = Object.entries(categoryStats)
    .sort(([, a], [, b]) => {
      const rateA = a.total === 0 ? 0 : (a.completed / a.total);
      const rateB = b.total === 0 ? 0 : (b.completed / b.total);
      return rateB - rateA;
    })[0]?.[0] || 'None';
</script>

<div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
  <h2 class="text-xl font-bold mb-4">Productivity Insights</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="font-semibold text-gray-700">Completion Rate</h3>
      <p class="text-3xl font-bold text-blue-600">{completionRate}%</p>
      <p class="text-sm text-gray-500">{completedTodos} of {totalTodos} tasks</p>
    </div>
    
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="font-semibold text-gray-700">Most Productive Category</h3>
      <p class="text-xl font-bold text-blue-600 capitalize">{mostProductiveCategory}</p>
      {#if categoryStats[mostProductiveCategory]}
        <p class="text-sm text-gray-500">
          {Math.round((categoryStats[mostProductiveCategory].completed / categoryStats[mostProductiveCategory].total) * 100)}% complete
        </p>
      {/if}
    </div>
    
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="font-semibold text-gray-700">Active Categories</h3>
      <p class="text-3xl font-bold text-blue-600">{Object.keys(categoryStats).length}</p>
    </div>
  </div>

  <div class="bg-white p-4 rounded-lg shadow">
    <h3 class="font-semibold text-gray-700 mb-3">Category Performance</h3>
    <div class="space-y-3">
      {#each Object.entries(categoryStats) as [category, stats]}
        <div class="flex items-center justify-between">
          <span class="capitalize font-medium">{category}</span>
          <div class="flex items-center gap-3 flex-1 max-w-[200px] ml-4">
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-500 rounded-full transition-all duration-300"
                style="width: {stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)}%"
              ></div>
            </div>
            <span class="text-sm text-gray-600 w-16 text-right">
              {stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)}%
            </span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>