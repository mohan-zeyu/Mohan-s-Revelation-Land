<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api/client';

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
  let showForm = false;
  let editingPost: Post | null = null;

  // Form fields
  let title = '';
  let content = '';
  let category = 'dynamics';

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
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
    content = '';
    category = 'dynamics';
    showForm = true;
  }

  function openEditForm(post: Post) {
    editingPost = post;
    title = post.title;
    content = post.content;
    category = post.category;
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingPost = null;
    title = '';
    content = '';
    category = 'dynamics';
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';

    try {
      if (editingPost) {
        await api.updatePost(editingPost.id, title, content, category);
      } else {
        await api.createPost(title, content, category);
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
  <title>Admin Dashboard - My Personal Blog</title>
</svelte:head>

<div class="container">
  <header class="admin-header">
    <h1>Admin Dashboard</h1>
    <button class="primary" on:click={openNewPostForm}>+ New Post</button>
  </header>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if showForm}
    <div class="modal-overlay" on:click={closeForm}>
      <div class="modal" on:click|stopPropagation>
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
              <p class="excerpt">{post.content.substring(0, 100)}...</p>
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

<style>
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .admin-header h1 {
    color: var(--primary-color);
    margin: 0;
  }

  .posts-section h2 {
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }

  .posts-table {
    display: grid;
    gap: 1rem;
  }

  .post-row {
    background: var(--card-background);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .post-info {
    flex: 1;
  }

  .post-info h3 {
    margin: 0 0 0.5rem 0;
    color: var(--primary-color);
  }

  .post-meta {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .category-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    color: white;
  }

  .category-badge.dynamics {
    background-color: #3b82f6;
  }

  .category-badge.study-notes {
    background-color: #10b981;
  }

  .category-badge.daily-findings {
    background-color: #f59e0b;
  }

  .date {
    color: #64748b;
    font-size: 0.9rem;
  }

  .excerpt {
    color: #64748b;
    margin: 0;
  }

  .post-actions {
    display: flex;
    gap: 0.5rem;
  }

  .edit-btn, .delete-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
  }

  .edit-btn {
    background-color: var(--primary-color);
    color: white;
  }

  .edit-btn:hover {
    background-color: var(--secondary-color);
  }

  .delete-btn {
    background-color: #ef4444;
    color: white;
  }

  .delete-btn:hover {
    background-color: #dc2626;
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
    background: var(--card-background);
    border-radius: 12px;
    padding: 2rem;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
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

  select {
    font-family: 'Comic Sans MS', cursive;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    width: 100%;
    background: white;
  }

  select:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .loading, .no-posts {
    text-align: center;
    color: #64748b;
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
