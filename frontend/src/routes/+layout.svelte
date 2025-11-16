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
    /* padding: 1rem 0; */
  }

  footer {
    position: relative;
    padding: 2.5rem 0;
    margin-top: 4rem;
    overflow: hidden;
  }

  footer::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(118, 240, 245, 0.2), transparent 55%);
    opacity: 0.8;
    pointer-events: none;
  }

  :global(footer .container) {
    padding: 0 1.75rem;
    text-align: center;
  }

  footer p {
    position: relative;
    display: inline-block;
    color: rgba(255, 255, 255, 0.78);
    margin: 0;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    font-size: 0.75rem;
  }
</style>
