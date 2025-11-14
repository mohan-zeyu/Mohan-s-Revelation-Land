<script lang="ts">
  export let post: {
    id: number;
    title: string;
    content: string;
    category: string;
    created_at: string;
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getExcerpt(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
</script>

<article class="post-card">
  <div class="post-header">
    <h3>{post.title}</h3>
    <span class="date">{formatDate(post.created_at)}</span>
  </div>
  <p class="content">{getExcerpt(post.content)}</p>
</article>

<style>
  .post-card {
    background: var(--card-background);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: var(--shadow);
    margin-bottom: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .post-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  h3 {
    color: var(--primary-color);
    margin: 0;
    font-size: 1.5rem;
  }

  .date {
    color: #64748b;
    font-size: 0.9rem;
  }

  .content {
    color: var(--text-color);
    line-height: 1.8;
    margin: 0;
  }
</style>
