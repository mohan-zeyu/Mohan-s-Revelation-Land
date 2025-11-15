<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import { authStore } from '$lib/stores/auth';
  import { onMount } from 'svelte';

  onMount(() => {
    authStore.checkAuth();
  });
</script>

<div class="app">
  <Header />
  <main>
    <slot />
  </main>
  <footer>
    <div class="container">
      <p>&copy; {new Date().getFullYear()} Revelation Land · Crafted by Mohan.</p>
    </div>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    padding: 1.5rem 0;
  }

  footer {
    background: rgba(233, 236, 239, 0.7);
    border-top: 1px solid var(--border-color);
    padding: 1.1rem 0;
    margin-top: 2.5rem;
  }

  :global(footer .container) {
    padding: 0 1.5rem;
  }

  footer p {
    text-align: center;
    color: var(--muted-text);
    margin: 0;
  }
</style>
