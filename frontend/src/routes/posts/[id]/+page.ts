import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Post, Comment } from '$lib/types';

export const load: PageLoad = async ({ params, fetch }) => {
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    throw error(400, 'Invalid post id');
  }

  const postResponse = await fetch(`/api/posts/${id}`);
  const commentsResponse = await fetch(`/api/posts/${id}/comments`);

  if (postResponse.status === 404) {
    throw error(404, 'Post not found');
  }

  if (!postResponse.ok) {
    throw error(postResponse.status, 'Failed to load post');
  }

  if (!commentsResponse.ok) {
    throw error(commentsResponse.status, 'Failed to load comments');
  }

  const post: Post = await postResponse.json();
  const comments: Comment[] = await commentsResponse.json();

  return {
    post,
    comments
  };
};
