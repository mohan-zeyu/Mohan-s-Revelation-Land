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
        <h2>My Personal Blog</h2>
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
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }

  .logo h2 {
    margin: 0;
    color: var(--primary-color);
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
    align-items: center;
  }

  .nav-links a {
    font-size: 1.1rem;
    font-weight: 600;
    transition: color 0.2s;
  }

  .nav-links a.active {
    color: var(--secondary-color);
    border-bottom: 3px solid var(--secondary-color);
  }

  .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    background-color: #ef4444;
    color: white;
  }

  .logout-btn:hover {
    background-color: #dc2626;
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
