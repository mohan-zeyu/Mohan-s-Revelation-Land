import type { PageLoad } from './$types';
import type { Post } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const response = await fetch('/api/posts');

    if (!response.ok) {
      return { posts: [] as Post[], error: 'Unable to load posts.' };
    }

    const posts: Post[] = await response.json();
    return { posts };
  } catch (error) {
    return { posts: [] as Post[], error: 'Unable to load posts.' };
  }
};
