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
  <title>Study Notes - My Personal Blog</title>
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
    padding: 2rem 0;
  }

  .page-header h1 {
    font-size: 3rem;
    color: #10b981;
    margin-bottom: 1rem;
  }

  .description {
    font-size: 1.2rem;
    color: #64748b;
    margin: 0;
  }

  .posts-section {
    max-width: 900px;
    margin: 0 auto;
  }

  .posts-list {
    display: grid;
    gap: 1.5rem;
  }

  .loading, .no-posts {
    text-align: center;
    color: #64748b;
    font-size: 1.2rem;
    padding: 3rem;
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 2rem;
    }

    .description {
      font-size: 1rem;
    }
  }
</style>
