<script lang="ts">
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  import type { Post } from '$lib/types';

  interface TocItem {
    id: string;
    text: string;
    level: number;
  }

  export let data: { post: Post };

  const post = data.post;
  const toc: TocItem[] = [];
  const slugCounts = new Map<string, number>();
  const categoryLabels: Record<Post['category'], string> = {
    dynamics: 'Dynamics',
    'study-notes': 'Study Notes',
    'daily-findings': 'Daily Findings'
  };

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
