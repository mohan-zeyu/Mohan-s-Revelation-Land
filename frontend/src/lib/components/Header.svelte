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
        <span class="divider" aria-hidden="true">·</span>
        <span class="tagline">Mohan</span>
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
    background: rgba(3, 8, 18, 0.78);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  :global(header .container) {
    padding: 0.4rem 1.75rem;
  }

  nav {
    min-height: 58px;
  }

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 58px;
    gap: 1.25rem;
  }

  .logo {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    line-height: 1;
  }

  .logo-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.24em;
    color: var(--heading-color);
    text-transform: uppercase;
  }

  .divider {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.35);
  }

  .tagline {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.55);
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .nav-links {
    display: flex;
    gap: 1.25rem;
    list-style: none;
    align-items: center;
    margin: 0;
  }

  .nav-links a {
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding-bottom: 0.3rem;
    border-bottom: 2px solid transparent;
    color: rgba(255, 255, 255, 0.55);
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
    padding: 0.45rem 1.2rem;
    font-size: 0.82rem;
    background: var(--danger-color);
    color: #04111b;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-weight: 600;
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
