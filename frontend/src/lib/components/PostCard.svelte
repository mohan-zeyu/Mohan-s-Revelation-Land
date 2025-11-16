<script lang="ts">
  import type { Post } from '$lib/types';

  export let post: Post;

  const categoryLabels: Record<Post['category'], string> = {
    dynamics: 'Dynamics',
    'study-notes': 'Study Notes',
    'daily-findings': 'Daily Findings'
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatCategory(category: Post['category']): string {
    return categoryLabels[category] ?? category;
  }

</script>

<a
  class="post-card"
  href={`/posts/${post.id}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <div class="post-header">
    <div>
      <h3>{post.title}</h3>
      <p class="meta">{formatDate(post.created_at)}</p>
    </div>
    <span class={`category-tag ${post.category}`}>{formatCategory(post.category)}</span>
  </div>
  <p class="abstract">{post.abstract}</p>
</a>

<style>
  .post-card {
    display: block;
    padding: 0 0 1.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    color: inherit;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .post-card:hover {
    border-color: rgba(118, 240, 245, 0.5);
    transform: translateX(4px);
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .post-header h3 {
    color: var(--heading-color);
    margin: 0 0 0.35rem 0;
    font-size: 1.4rem;
    line-height: 1.3;
  }

  .meta {
    margin: 0;
    font-size: 0.82rem;
    color: rgba(213, 231, 255, 0.65);
    text-transform: uppercase;
    letter-spacing: 0.24em;
  }

  .category-tag {
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    color: #02070f;
    white-space: nowrap;
  }

  .category-tag.dynamics {
    background: linear-gradient(135deg, #7dd3ff, #4c90ff);
  }

  .category-tag.study-notes {
    background: linear-gradient(135deg, #6fedc5, #38cc9a);
  }

  .category-tag.daily-findings {
    background: linear-gradient(135deg, #f7c979, #f38b3c);
  }

  .abstract {
    margin: 0;
    font-size: 1rem;
    line-height: 1.9;
    color: var(--text-color);
    opacity: 0.92;
  }

  @media (max-width: 640px) {
    .post-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .category-tag {
      margin-top: 0.25rem;
    }
  }
</style>
