<script lang="ts">
    import { todos } from '$lib/stores/todoStore';
    import { analyzeProductivity } from '$lib/utils/taskAnalytics';
    import { onMount } from 'svelte';
    
    let insights: any = null;
    let loading = true;
    let error = null;
    
    async function updateInsights() {
      try {
        loading = true;
        insights = await analyzeProductivity($todos);
      } catch (e) {
        error = 'Failed to load insights';
        console.error(e);
      } finally {
        loading = false;
      }
    }
    
    onMount(updateInsights);
    
    // Update insights when todos change, but not too frequently
    let timeout: ReturnType<typeof setTimeout>;
    $: if ($todos.length) {
      clearTimeout(timeout);
      timeout = setTimeout(updateInsights, 2000); // Debounce for 2 seconds
    }
  </script>
  
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
    <h2 class="text-xl font-bold mb-4">Productivity Insights</h2>
    
    {#if loading}
      <div class="animate-pulse">
        <div class="h-4 bg-blue-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-blue-200 rounded w-1/2"></div>
      </div>
    {:else if error}
      <p class="text-red-500">{error}</p>
    {:else if insights}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="font-semibold text-gray-700">Completion Rate</h3>
          <p class="text-3xl font-bold text-blue-600">{insights.completionRate}%</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="font-semibold text-gray-700">Most Productive Category</h3>
          <p class="text-xl font-medium text-blue-600 capitalize">
            {insights.mostProductiveCategory}
          </p>
        </div>
      </div>
  
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="font-semibold text-gray-700 mb-2">Suggested Improvements</h3>
        <ul class="space-y-2">
          {#each insights.suggestedImprovements as suggestion}
            <li class="flex items-start">
              <span class="text-blue-500 mr-2">•</span>
              <span>{suggestion}</span>
            </li>
          {/each}
        </ul>
      </div>
      
      {#if insights.timeManagementTips}
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
          <h3 class="font-semibold text-gray-700 mb-2">Time Management Tips</h3>
          <ul class="space-y-2">
            {#each insights.timeManagementTips as tip}
              <li class="flex items-start">
                <span class="text-green-500 mr-2">•</span>
                <span>{tip}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/if}
  </div>