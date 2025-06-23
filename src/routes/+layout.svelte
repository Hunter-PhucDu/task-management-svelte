<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {
    document.body.classList.add('task-manager-app');
  });
</script>

<div class="app-container">
  <slot />
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #333;
    background-color: #f5f7fb;
  }

  :global(body.task-manager-app) {
    --primary-color: #4c6ef5;
    --primary-hover: #3b5bdb;
    --success-color: #20c997;
    --warning-color: #fcc419;
    --danger-color: #ff6b6b;
    --gray-100: #f8f9fa;
    --gray-200: #e9ecef;
    --gray-300: #dee2e6;
    --gray-400: #ced4da;
    --gray-500: #adb5bd;
    --gray-600: #6c757d;
    --gray-700: #495057;
    --gray-800: #343a40;
    --gray-900: #212529;
  }

  :global(*, *:before, *:after) {
    box-sizing: border-box;
  }

  :global(h1, h2, h3, h4, h5, h6, p) {
    margin-top: 0;
  }

  :global(a) {
    color: var(--primary-color);
    text-decoration: none;
  }

  :global(a:hover) {
    text-decoration: underline;
  }

  :global(button) {
    cursor: pointer;
  }

  :global(button:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>