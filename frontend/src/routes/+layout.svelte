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
      <p>&copy; {new Date().getFullYear()} My Personal Blog. All rights reserved.</p>
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
    padding: 2rem 0;
  }

  footer {
    background: white;
    border-top: 1px solid var(--border-color);
    padding: 2rem 0;
    margin-top: 4rem;
  }

  footer p {
    text-align: center;
    color: #64748b;
    margin: 0;
  }
</style>
