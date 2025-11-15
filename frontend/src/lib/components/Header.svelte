<script lang="ts">
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  function handleLogout() {
    authStore.logout();
    goto('/');
  }
</script>

<header>
  <nav class="container">
    <div class="nav-content">
      <a href="/" class="logo">
        <span class="logo-title">Revelation Land</span>
        <span class="tagline">by Mohan</span>
      </a>

      <ul class="nav-links">
        <li>
          <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
        </li>
        <li>
          <a href="/dynamics" class:active={$page.url.pathname === '/dynamics'}>Dynamics</a>
        </li>
        <li>
          <a href="/study-notes" class:active={$page.url.pathname === '/study-notes'}>Study Notes</a>
        </li>
        <li>
          <a href="/daily-findings" class:active={$page.url.pathname === '/daily-findings'}>Daily Findings</a>
        </li>
        <li>
          <a href="/recent" class:active={$page.url.pathname === '/recent'}>Recent Posts</a>
        </li>
        {#if $authStore.isAuthenticated}
          <li>
            <a href="/admin" class:active={$page.url.pathname === '/admin'}>Admin</a>
          </li>
          <li>
            <button class="logout-btn" on:click={handleLogout}>Logout</button>
          </li>
        {/if}
      </ul>
    </div>
  </nav>
</header>

<style>
  header {
    background: rgba(248, 249, 250, 0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  :global(header .container) {
    padding: 0 1.5rem;
  }

  nav {
    min-height: 50px;
  }

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    gap: 1.5rem;
  }

  .logo {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  .logo-title {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--heading-color);
  }

  .tagline {
    font-size: 0.75rem;
    color: var(--muted-text);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-top: 0.3rem;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    align-items: center;
    margin: 0;
  }

  .nav-links a {
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding-bottom: 0.2rem;
    border-bottom: 2px solid transparent;
    color: var(--muted-text);
    transition: border-color 0.2s ease, color 0.2s ease;
  }

  .nav-links a:hover {
    color: var(--heading-color);
  }

  .nav-links a.active {
    color: var(--heading-color);
    border-bottom-color: var(--primary-color);
  }

  .logout-btn {
    padding: 0.45rem 1.1rem;
    font-size: 0.85rem;
    background-color: var(--danger-color);
    color: var(--surface-color);
    border-radius: 999px;
  }

  .logout-btn:hover {
    background-color: var(--danger-color-stronger);
  }

  @media (max-width: 768px) {
    .nav-content {
      flex-direction: column;
      gap: 1rem;
    }

    .nav-links {
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
  }
</style>
