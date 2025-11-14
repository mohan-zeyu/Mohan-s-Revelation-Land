<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client';
  import PostCard from '$lib/components/PostCard.svelte';

  interface Post {
    id: number;
    title: string;
    content: string;
    category: string;
    created_at: string;
  }

  let recentPosts: Post[] = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const posts = await api.getPosts();
      recentPosts = posts.slice(0, 6); // Show only 6 most recent posts
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load posts';
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Home - My Personal Blog</title>
</svelte:head>

<div class="container">
  <section class="hero">
    <h1>Welcome to My Personal Blog! 🎉</h1>
    <p class="tagline">
      A place where I share my dynamics, study notes, and interesting findings from daily life.
    </p>
  </section>

  <section class="categories">
    <div class="category-grid">
      <a href="/dynamics" class="category-card dynamics">
        <h3>📱 Dynamics</h3>
        <p>Personal updates and what's happening in my life</p>
      </a>

      <a href="/study-notes" class="category-card study-notes">
        <h3>📚 Study Notes</h3>
        <p>Learning materials and knowledge I've gathered</p>
      </a>

      <a href="/daily-findings" class="category-card daily-findings">
        <h3>🔍 Daily Findings</h3>
        <p>Interesting discoveries and observations from everyday life</p>
      </a>
    </div>
  </section>

  <section class="recent-posts">
    <h2>Recent Posts</h2>

    {#if loading}
      <p>Loading posts...</p>
    {:else if error}
      <div class="error">{error}</div>
    {:else if recentPosts.length === 0}
      <p class="no-posts">No posts yet. Check back later!</p>
    {:else}
      <div class="posts-grid">
        {#each recentPosts as post (post.id)}
          <PostCard {post} />
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .hero {
    text-align: center;
    padding: 3rem 0;
    margin-bottom: 3rem;
  }

  .hero h1 {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .tagline {
    font-size: 1.3rem;
    color: #64748b;
    max-width: 700px;
    margin: 0 auto;
  }

  .categories {
    margin-bottom: 4rem;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .category-card {
    background: var(--card-background);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
    text-decoration: none;
    color: var(--text-color);
    border: 3px solid transparent;
  }

  .category-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
  }

  .category-card.dynamics {
    border-color: #3b82f6;
  }

  .category-card.study-notes {
    border-color: #10b981;
  }

  .category-card.daily-findings {
    border-color: #f59e0b;
  }

  .category-card h3 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  .category-card p {
    margin: 0;
    color: #64748b;
  }

  .recent-posts h2 {
    margin-bottom: 2rem;
    color: var(--primary-color);
  }

  .posts-grid {
    display: grid;
    gap: 1.5rem;
  }

  .no-posts {
    text-align: center;
    color: #64748b;
    font-size: 1.2rem;
    padding: 3rem;
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2rem;
    }

    .tagline {
      font-size: 1.1rem;
    }

    .category-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
