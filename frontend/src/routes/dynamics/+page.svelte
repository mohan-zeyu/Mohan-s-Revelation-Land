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
      posts = await api.getPostsByCategory('dynamics');
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load posts';
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Dynamics - Revelation Land</title>
</svelte:head>

<div class="container page-grid dynamics-page">
  <section class="section-hero">
    <p class="section-kicker">Dynamics</p>
    <h1>📱 Real-time dynamics</h1>
    <p class="section-description">
      Personal updates, whispers, and progress logs as they happen. Follow the flow just like the rain on
      the home page.
    </p>
  </section>

  <section class="posts-shell">
    {#if loading}
      <p class="status-text">Summoning the latest updates...</p>
    {:else if error}
      <div class="error">{error}</div>
    {:else if posts.length === 0}
      <p class="status-text">No dynamics yet. The next breakthrough is on its way.</p>
    {:else}
      <div class="posts-meta">
        <span>{posts.length === 1 ? '1 entry' : `${posts.length} entries`}</span>
        <span>fresh drops</span>
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
  .dynamics-page {
    padding-top: 4rem;
  }

  .dynamics-page .posts-meta span:first-child {
    background: rgba(125, 211, 255, 0.12);
    border-color: rgba(125, 211, 255, 0.4);
    color: var(--heading-color);
  }

  @media (max-width: 768px) {
    .dynamics-page {
      padding-top: 2rem;
    }
  }
</style>
