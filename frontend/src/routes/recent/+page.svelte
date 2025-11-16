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

<div class="container page-grid recent-page">
  <section class="section-hero">
    <p class="section-kicker">Recent</p>
    <h1>Latest across Revelation Land</h1>
    <p class="section-description">
      A chronological feed of everything new. Posts open in a dedicated view with Markdown rendering and
      an auto-generated table of contents.
    </p>
  </section>

  <section class="posts-shell">
    {#if error}
      <div class="error">{error}</div>
    {:else if posts.length === 0}
      <p class="status-text">No posts published yet. Check back soon!</p>
    {:else}
      <div class="posts-meta">
        <span>{posts.length === 1 ? '1 entry' : `${posts.length} entries`}</span>
        <span>chronicle</span>
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
  .recent-page {
    padding-top: 4rem;
  }

  .recent-page .posts-meta span:first-child {
    background: rgba(125, 211, 255, 0.08);
    border-color: rgba(125, 211, 255, 0.3);
    color: var(--heading-color);
  }

  @media (max-width: 768px) {
    .recent-page {
      padding-top: 2rem;
    }
  }
</style>
