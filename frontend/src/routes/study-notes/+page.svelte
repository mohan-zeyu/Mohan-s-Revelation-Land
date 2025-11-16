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
      posts = await api.getPostsByCategory('study-notes');
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load posts';
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Study Notes - Revelation Land</title>
</svelte:head>

<div class="container page-grid study-page">
  <section class="section-hero">
    <p class="section-kicker">Study notes</p>
    <h1>📚 Curated knowledge drops</h1>
    <p class="section-description">
      Reference sheets, research recaps, and distilled lessons collected along the way.
    </p>
  </section>

  <section class="posts-shell">
    {#if loading}
      <p class="status-text">Gathering notebooks...</p>
    {:else if error}
      <div class="error">{error}</div>
    {:else if posts.length === 0}
      <p class="status-text">No study notes yet. Fresh knowledge is on the horizon.</p>
    {:else}
      <div class="posts-meta">
        <span>{posts.length === 1 ? '1 entry' : `${posts.length} entries`}</span>
        <span>reference deck</span>
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
  .study-page {
    padding-top: 4rem;
  }

  .study-page .posts-meta span:first-child {
    background: rgba(111, 237, 197, 0.12);
    border-color: rgba(111, 237, 197, 0.4);
    color: var(--heading-color);
  }

  @media (max-width: 768px) {
    .study-page {
      padding-top: 2rem;
    }
  }
</style>
