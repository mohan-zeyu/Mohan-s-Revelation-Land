import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Post } from '$lib/types';

export const load: PageLoad = async ({ params, fetch }) => {
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    throw error(400, 'Invalid post id');
  }

  const response = await fetch(`/api/posts/${id}`);

  if (response.status === 404) {
    throw error(404, 'Post not found');
  }

  if (!response.ok) {
    throw error(response.status, 'Failed to load post');
  }

  const post: Post = await response.json();

  return {
    post
  };
};
