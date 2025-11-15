<script lang="ts">
  import PostCard from '$lib/components/PostCard.svelte';
  import type { Post } from '$lib/types';

  export let data: { posts: Post[]; error?: string };

  const posts = data.posts;
  const error = data.error;
</script>

<svelte:head>
  <title>Recent Posts - Revelation Land</title>
  <meta name="description" content="Catch up on the most recent posts from Mohan at Revelation Land." />
</svelte:head>

<div class="container recent">
  <header class="page-header">
    <h1>Recent Posts</h1>
    <p class="description">
      A chronological feed of everything new in Revelation Land. Posts open in a new tab with
      full Markdown rendering and an auto-generated table of contents.
    </p>
  </header>

  {#if error}
    <div class="error">{error}</div>
  {:else if posts.length === 0}
    <p class="empty">No posts published yet. Check back soon!</p>
  {:else}
    <div class="posts-list">
      {#each posts as post (post.id)}
        <PostCard {post} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .recent {
    max-width: 900px;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    font-size: 2.6rem;
    margin-bottom: 0.75rem;
  }

  .description {
    color: var(--muted-text);
    margin: 0;
    line-height: 1.7;
  }

  .posts-list {
    display: grid;
    gap: 1.5rem;
  }

  .empty {
    text-align: center;
    color: var(--muted-text);
    padding: 3rem 0;
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 2rem;
    }
  }
</style>
