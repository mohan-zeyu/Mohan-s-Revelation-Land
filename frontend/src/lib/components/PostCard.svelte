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
  background: var(--card-background);
  border-radius: 12px;
  padding: 1.75rem;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  color: inherit;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: var(--shadow);
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
}

.meta {
  margin: 0;
  font-size: 0.9rem;
  color: var(--muted-text);
  text-transform: capitalize;
}

.category-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--surface-color);
}

.category-tag.dynamics {
  background-color: var(--accent-blue);
}

.category-tag.study-notes {
  background-color: var(--accent-green);
}

.category-tag.daily-findings {
  background-color: var(--accent-amber);
}

.abstract {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-color);
}
</style>
