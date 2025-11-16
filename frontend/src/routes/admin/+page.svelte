<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api/client';
  import type { Post } from '$lib/types';

  let posts: Post[] = [];
  let loading = true;
  let error = '';
  let showForm = false;
  let editingPost: Post | null = null;
  let checkingAuth = true;

  // Form fields
  let title = '';
  let abstract = '';
  let content = '';
  let category = 'dynamics';

  onMount(async () => {
    const isAuthed = await authStore.checkAuth();
    checkingAuth = false;

    if (!isAuthed) {
      goto('/login');
      return;
    }

    await loadPosts();
  });

  async function loadPosts() {
    try {
      loading = true;
      posts = await api.getPosts();
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load posts';
      loading = false;
    }
  }

  function openNewPostForm() {
    editingPost = null;
    title = '';
    abstract = '';
    content = '';
    category = 'dynamics';
    showForm = true;
  }

  function openEditForm(post: Post) {
    editingPost = post;
    title = post.title;
    abstract = post.abstract;
    content = post.content;
    category = post.category;
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingPost = null;
    title = '';
    abstract = '';
    content = '';
    category = 'dynamics';
  }

  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeForm();
    }
  }

  function handleOverlayKeydown(event: KeyboardEvent) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closeForm();
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';

    try {
      if (editingPost) {
        await api.updatePost(editingPost.id, title, abstract, content, category);
      } else {
        await api.createPost(title, abstract, content, category);
      }

      closeForm();
      await loadPosts();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save post';
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.deletePost(id);
      await loadPosts();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to delete post';
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Admin Dashboard - Revelation Land</title>
</svelte:head>

{#if checkingAuth}
  <div class="container auth-loading">
    <p>Validating session...</p>
  </div>
{:else}
  <div class="container">
  <header class="admin-header">
    <h1>Admin Dashboard</h1>
    <button class="primary" on:click={openNewPostForm}>+ New Post</button>
  </header>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if showForm}
    <div
      class="modal-overlay"
      role="button"
      tabindex="0"
      on:click={handleOverlayClick}
      on:keydown={handleOverlayKeydown}
      aria-label="Close post editor"
    >
      <div class="modal" role="dialog" aria-modal="true" tabindex="-1">
        <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>

        <form on:submit={handleSubmit}>
          <div class="form-group">
            <label for="title">Title</label>
            <input
              type="text"
              id="title"
              bind:value={title}
              placeholder="Enter post title"
              required
            />
          </div>

          <div class="form-group">
            <label for="abstract">Abstract</label>
            <textarea
              id="abstract"
              bind:value={abstract}
              placeholder="Write a short summary that will appear in listings"
              rows="3"
              required
            ></textarea>
            <p class="field-hint">Aim for one or two concise sentences.</p>
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" bind:value={category} required>
              <option value="dynamics">Dynamics</option>
              <option value="study-notes">Study Notes</option>
              <option value="daily-findings">Daily Findings</option>
            </select>
          </div>

          <div class="form-group">
            <label for="content">Content</label>
            <textarea
              id="content"
              bind:value={content}
              placeholder="Write your post content..."
              rows="10"
              required
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="secondary" on:click={closeForm}>
              Cancel
            </button>
            <button type="submit" class="primary">
              {editingPost ? 'Update' : 'Create'} Post
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <section class="posts-section">
    <h2>All Posts ({posts.length})</h2>

    {#if loading}
      <p class="loading">Loading posts...</p>
    {:else if posts.length === 0}
      <p class="no-posts">No posts yet. Create your first post!</p>
    {:else}
      <div class="posts-table">
        {#each posts as post (post.id)}
          <div class="post-row">
            <div class="post-info">
              <h3>{post.title}</h3>
              <div class="post-meta">
                <span class="category-badge {post.category}">{post.category}</span>
                <span class="date">{formatDate(post.created_at)}</span>
              </div>
              <p class="abstract">{post.abstract}</p>
            </div>
            <div class="post-actions">
              <button class="edit-btn" on:click={() => openEditForm(post)}>
                Edit
              </button>
              <button class="delete-btn" on:click={() => handleDelete(post.id)}>
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
  </div>
{/if}

<style>
  .auth-loading {
    min-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auth-loading p {
    color: var(--muted-text);
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .admin-header h1 {
    color: var(--heading-color);
    margin: 0;
    font-size: 2.2rem;
  }

  .posts-section h2 {
    margin-bottom: 1.5rem;
    color: var(--heading-color);
  }

  .posts-table {
    display: grid;
    gap: 1.25rem;
  }

  .post-row {
    background: var(--surface-elevated);
    border-radius: 14px;
    padding: 1.75rem;
    border: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.25rem;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .post-row:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
  }

  .post-info {
    flex: 1;
  }

  .post-info h3 {
    margin: 0 0 0.5rem 0;
    color: var(--heading-color);
  }

  .post-meta {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  .category-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--surface-color);
  }

  .category-badge.dynamics {
    background-color: var(--accent-blue);
  }

  .category-badge.study-notes {
    background-color: var(--accent-green);
  }

  .category-badge.daily-findings {
    background-color: var(--accent-amber);
  }

  .date {
    color: var(--muted-text);
    font-size: 0.9rem;
  }

  .abstract {
    color: var(--text-color);
    margin: 0;
    line-height: 1.6;
  }

  .post-actions {
    display: flex;
    gap: 0.5rem;
  }

  .edit-btn,
  .delete-btn {
    padding: 0.55rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
  }

  .edit-btn {
    background-color: var(--primary-color);
    color: var(--surface-color);
  }

  .edit-btn:hover {
    background-color: var(--secondary-color);
  }

  .delete-btn {
    background-color: var(--danger-color);
    color: var(--surface-color);
  }

  .delete-btn:hover {
    background-color: var(--danger-color-stronger);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    background: var(--surface-elevated);
    border-radius: 16px;
    padding: 2.25rem;
    max-width: 720px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
  }

  .modal h2 {
    color: var(--heading-color);
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--heading-color);
    font-weight: 600;
  }

  .field-hint {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: var(--muted-text);
  }

  select {
    font-family: var(--font-family-base);
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    width: 100%;
    background: var(--surface-color);
  }

  select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px rgba(73, 80, 87, 0.12);
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .loading,
  .no-posts {
    text-align: center;
    color: var(--muted-text);
    font-size: 1.1rem;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .admin-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .post-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .post-actions {
      width: 100%;
    }

    .edit-btn, .delete-btn {
      flex: 1;
    }

    .modal {
      padding: 1.5rem;
    }
  }
</style>
