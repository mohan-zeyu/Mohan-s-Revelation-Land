<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api/client';
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      const response = await api.login(username, password);
      authStore.login(response.token, response.user);
      goto('/admin');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Login failed';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Login - My Personal Blog</title>
</svelte:head>

<div class="container">
  <div class="login-wrapper">
    <div class="login-card">
      <h1>Admin Login</h1>
      <p class="subtitle">Sign in to manage your blog content</p>

      {#if error}
        <div class="error">{error}</div>
      {/if}

      <form on:submit={handleLogin}>
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            bind:value={username}
            placeholder="Enter your username"
            required
            disabled={loading}
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" class="primary login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p class="back-link">
        <a href="/">← Back to Home</a>
      </p>
    </div>
  </div>
</div>

<style>
  .login-wrapper {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
  }

  .login-card {
    background: var(--card-background);
    border-radius: 12px;
    padding: 3rem;
    box-shadow: var(--shadow-lg);
    max-width: 450px;
    width: 100%;
  }

  h1 {
    text-align: center;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  .subtitle {
    text-align: center;
    color: #64748b;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-color);
    font-weight: 600;
  }

  .login-btn {
    width: 100%;
    margin-top: 1rem;
  }

  .back-link {
    text-align: center;
    margin-top: 1.5rem;
  }

  .back-link a {
    color: #64748b;
  }

  @media (max-width: 768px) {
    .login-card {
      padding: 2rem;
    }
  }
</style>
