<script lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  import { api } from '$lib/api/client';
  import type { Post, Comment } from '$lib/types';

  interface TocItem {
    id: string;
    text: string;
    level: number;
  }

  export let data: { post: Post; comments: Comment[] };

  const post = data.post;
  const toc: TocItem[] = [];
  const slugCounts = new Map<string, number>();
  const categoryLabels: Record<Post['category'], string> = {
    dynamics: 'Dynamics',
    'study-notes': 'Study Notes',
    'daily-findings': 'Daily Findings'
  };

  let comments: Comment[] = data.comments;
  let commenterName = '';
  let commentContent = '';
  let commentError = '';
  let commentSubmitting = false;

  const slugify = (input: string) => {
    const plain = input
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const hit = slugCounts.get(plain) ?? 0;
    slugCounts.set(plain, hit + 1);
    return hit ? `${plain}-${hit}` : plain;
  };

  const renderer = new marked.Renderer();

  renderer.heading = (text, level) => {
    const plainText = text.replace(/<[^>]+>/g, '');
    const slug = slugify(plainText);
    if (level <= 4) {
      toc.push({ id: slug, text: plainText, level });
    }
    return `<h${level} id="${slug}">${text}</h${level}>`;
  };

  marked.setOptions({ mangle: false, headerIds: false, renderer });

  const html = DOMPurify.sanitize(marked.parse(post.content));

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async function submitComment() {
    commentError = '';
    const content = commentContent.trim();

    if (!content) {
      commentError = 'Please enter a comment.';
      return;
    }

    commentSubmitting = true;

    try {
      const name = commenterName.trim();
      const comment = (await api.createComment(post.id, name ? name : null, content)) as Comment;
      comments = [...comments, comment];
      commentContent = '';
    } catch (err) {
      commentError = err instanceof Error ? err.message : 'Failed to submit comment';
    } finally {
      commentSubmitting = false;
    }
  }
</script>


<svelte:head>
  <title>{post.title} - Revelation Land</title>
  <meta name="description" content={post.abstract} />
</svelte:head>

<div class="container post-layout">
  <article class="post">
    <header class="post-header">
      <p class="meta">{formatDate(post.created_at)} · {categoryLabels[post.category]}</p>
      <h1>{post.title}</h1>
      <p class="abstract">{post.abstract}</p>
    </header>
    <div class="post-content">{@html html}</div>

    <section class="comments" aria-label="Comments">
      <h2>Comments ({comments.length})</h2>

      <form class="comment-form" on:submit|preventDefault={submitComment}>
        <div class="form-group">
          <label for="comment-name">Name (optional)</label>
          <input
            id="comment-name"
            type="text"
            maxlength="80"
            placeholder="Leave blank to post anonymously"
            bind:value={commenterName}
          />
        </div>

        <div class="form-group">
          <label for="comment-content">Your comment</label>
          <textarea
            id="comment-content"
            rows="4"
            maxlength="2000"
            placeholder="Share your thoughts..."
            bind:value={commentContent}
            required
          ></textarea>
        </div>

        {#if commentError}
          <p class="comment-error">{commentError}</p>
        {/if}

        <button class="primary" type="submit" disabled={commentSubmitting}>
          {commentSubmitting ? 'Posting...' : 'Post comment'}
        </button>
      </form>

      {#if comments.length === 0}
        <p class="empty">No comments yet. Be the first to share a thought.</p>
      {:else}
        <div class="comment-list">
          {#each comments as comment (comment.id)}
            <article class="comment">
              <div class="comment-meta">
                <span class="comment-author">{comment.name || 'Anonymous'}</span>
                <span class="comment-date">{formatDateTime(comment.created_at)}</span>
              </div>
              <p class="comment-body">{comment.content}</p>
            </article>
          {/each}
        </div>
      {/if}
    </section>
  </article>

  <aside class="toc" aria-label="Table of contents">
    <h2>Table of contents</h2>
    {#if toc.length === 0}
      <p class="empty">No headings found in this post.</p>
    {:else}
      <nav>
        <ul>
          {#each toc as item}
            <li class={`level-${item.level}`}>
              <a href={`#${item.id}`}>{item.text}</a>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}
  </aside>
</div>

<style>
  .post-layout {
    display: grid;
    gap: 3rem;
    grid-template-columns: minmax(0, 3fr) minmax(220px, 1fr);
    align-items: start;
  }

  .post {
    background: var(--surface-elevated);
    border-radius: 18px;
    border: 1px solid var(--border-color);
    padding: 3rem;
    box-shadow: var(--shadow);
  }

  .post-header .meta {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.75rem;
    color: var(--muted-text);
    margin-bottom: 1rem;
  }

  .post-header h1 {
    margin: 0 0 1rem 0;
    font-size: 2.6rem;
  }

  .post-header .abstract {
    color: var(--muted-text);
    margin-bottom: 2.5rem;
    line-height: 1.8;
  }

  .post-content :global(p) {
    margin-bottom: 1.5rem;
    color: var(--text-color);
    line-height: 1.8;
  }

  .post-content :global(h2),
  .post-content :global(h3),
  .post-content :global(h4) {
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    position: relative;
  }

  .post-content :global(code) {
    font-family: 'Fira Code', 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
      monospace;
    background: rgba(206, 212, 218, 0.4);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .post-content :global(pre) {
    background: rgba(33, 37, 41, 0.85);
    color: #f8f9fa;
    padding: 1.2rem;
    border-radius: 10px;
    overflow-x: auto;
  }

  .post-content :global(blockquote) {
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid var(--primary-color);
    background: rgba(233, 236, 239, 0.6);
    color: var(--heading-color);
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .post-content :global(a) {
    color: var(--primary-color);
    text-decoration: underline;
  }

  .comments {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
  }

  .comments h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.8rem;
  }

  .comment-form {
    background: rgba(4, 7, 13, 0.55);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .comment-form .form-group {
    margin-bottom: 1.25rem;
  }

  .comment-form label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--heading-color);
    font-weight: 600;
  }

  .comment-form button {
    margin-top: 0.5rem;
  }

  .comment-error {
    color: var(--danger-color);
    margin: 0.5rem 0 1rem;
  }

  .comment-list {
    display: grid;
    gap: 1.25rem;
  }

  .comment {
    background: rgba(4, 7, 13, 0.55);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
  }

  .comment-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
    color: var(--muted-text);
  }

  .comment-author {
    color: var(--heading-color);
    font-weight: 600;
  }

  .comment-body {
    margin: 0;
    line-height: 1.65;
  }

  .toc {
    position: sticky;
    top: 6.5rem;
    background: var(--surface-elevated);
    border-radius: 16px;
    border: 1px solid var(--border-color);
    padding: 1.75rem;
    box-shadow: var(--shadow);
  }

  .toc h2 {
    margin-top: 0;
    font-size: 1.2rem;
  }

  .toc ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.6rem;
  }

  .toc li {
    font-size: 0.95rem;
    color: var(--muted-text);
  }

  .toc a {
    color: var(--heading-color);
  }

  .toc a:hover {
    color: var(--primary-color);
  }

  .toc li.level-3 {
    padding-left: 0.75rem;
    font-size: 0.9rem;
  }

  .toc li.level-4 {
    padding-left: 1.25rem;
    font-size: 0.85rem;
  }

  .empty {
    color: var(--muted-text);
    font-size: 0.9rem;
  }

  @media (max-width: 1024px) {
    .post-layout {
      grid-template-columns: 1fr;
    }

    .comments {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
  }

  .comments h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.8rem;
  }

  .comment-form {
    background: rgba(4, 7, 13, 0.55);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .comment-form .form-group {
    margin-bottom: 1.25rem;
  }

  .comment-form label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--heading-color);
    font-weight: 600;
  }

  .comment-form button {
    margin-top: 0.5rem;
  }

  .comment-error {
    color: var(--danger-color);
    margin: 0.5rem 0 1rem;
  }

  .comment-list {
    display: grid;
    gap: 1.25rem;
  }

  .comment {
    background: rgba(4, 7, 13, 0.55);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
  }

  .comment-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
    color: var(--muted-text);
  }

  .comment-author {
    color: var(--heading-color);
    font-weight: 600;
  }

  .comment-body {
    margin: 0;
    line-height: 1.65;
  }

  .toc {
      position: relative;
      top: auto;
      order: -1;
      margin-bottom: 2rem;
    }
  }

  @media (max-width: 640px) {
    .post {
      padding: 2rem;
    }

    .post-header h1 {
      font-size: 2.2rem;
    }
  }
</style>
