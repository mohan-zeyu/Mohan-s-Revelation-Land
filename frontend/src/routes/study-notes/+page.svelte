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

<div class="container">
  <header class="page-header">
    <h1>📚 Study Notes</h1>
    <p class="description">
      Learning materials and knowledge I've gathered
    </p>
  </header>

  <section class="posts-section">
    {#if loading}
      <p class="loading">Loading posts...</p>
    {:else if error}
      <div class="error">{error}</div>
    {:else if posts.length === 0}
      <p class="no-posts">No study notes yet. Check back later!</p>
    {:else}
      <div class="posts-list">
        {#each posts as post (post.id)}
          <PostCard {post} />
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .page-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2.5rem 0;
    background: var(--surface-elevated);
    border-radius: 16px;
    border: 1px solid var(--border-color);
  }

  .page-header h1 {
    font-size: 2.75rem;
    color: var(--heading-color);
    margin-bottom: 0.75rem;
  }

  .description {
    font-size: 1.1rem;
    color: var(--muted-text);
    margin: 0;
    max-width: 600px;
    margin-inline: auto;
  }

  .posts-section {
    max-width: 900px;
    margin: 0 auto;
  }

  .posts-list {
    display: grid;
    gap: 1.5rem;
  }

  .loading,
  .no-posts {
    text-align: center;
    color: var(--muted-text);
    font-size: 1.1rem;
    padding: 3rem;
  }

  @media (max-width: 768px) {
    .page-header {
      padding: 2rem 1.5rem;
    }

    .page-header h1 {
      font-size: 2.1rem;
    }

    .description {
      font-size: 1rem;
    }
  }
</style>
