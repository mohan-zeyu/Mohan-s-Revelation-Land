import { Request, Response } from 'express';
import { CommentModel } from '../models/Comment';
import { PostModel } from '../models/Post';

const MAX_COMMENT_LENGTH = 2000;
const MAX_NAME_LENGTH = 80;

export const getCommentsByPostId = (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ error: 'Invalid post id' });
    }

    const post = PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = CommentModel.findByPostId(postId);
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createComment = (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ error: 'Invalid post id' });
    }

    const post = PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { name, content } = req.body as { name?: string; content?: string };
    const trimmedContent = typeof content === 'string' ? content.trim() : '';
    const trimmedName = typeof name === 'string' ? name.trim() : '';

    if (!trimmedContent) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    if (trimmedContent.length > MAX_COMMENT_LENGTH) {
      return res.status(400).json({ error: 'Comment is too long' });
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      return res.status(400).json({ error: 'Name is too long' });
    }

    const comment = CommentModel.create(
      postId,
      trimmedName ? trimmedName : null,
      trimmedContent
    );

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
