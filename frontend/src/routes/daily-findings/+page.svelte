<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client';
  import PostCard from '$lib/components/PostCard.svelte';
  import type { Post } from '$lib/types';

  let posts: Post[] = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      posts = await api.getPostsByCategory('daily-findings');
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load posts';
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Daily Findings - Revelation Land</title>
</svelte:head>

<div class="container page-grid daily-page">
  <section class="section-hero">
    <p class="section-kicker">Daily findings</p>
    <h1>🔍 Everyday sparks</h1>
    <p class="section-description">
      Interesting discoveries, tiny experiments, and fleeting curiosities that deserve a home.
    </p>
  </section>

  <section class="posts-shell">
    {#if loading}
      <p class="status-text">Looking around for new curiosities...</p>
    {:else if error}
      <div class="error">{error}</div>
    {:else if posts.length === 0}
      <p class="status-text">No findings yet. Watch this space for serendipity.</p>
    {:else}
      <div class="posts-meta">
        <span>{posts.length === 1 ? '1 entry' : `${posts.length} entries`}</span>
        <span>field notes</span>
      </div>
      <div class="posts-grid">
        {#each posts as post (post.id)}
          <PostCard {post} />
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .daily-page {
    padding-top: 4rem;
  }

  .daily-page .posts-meta span:first-child {
    background: rgba(247, 201, 121, 0.12);
    border-color: rgba(247, 201, 121, 0.35);
    color: var(--heading-color);
  }

  @media (max-width: 768px) {
    .daily-page {
      padding-top: 2rem;
    }
  }
</style>
