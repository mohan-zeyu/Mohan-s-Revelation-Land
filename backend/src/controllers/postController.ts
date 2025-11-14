import { Response } from 'express';
import { PostModel } from '../models/Post';
import { AuthRequest } from '../middleware/auth';

export const getAllPosts = (req: AuthRequest, res: Response) => {
  try {
    const posts = PostModel.findAll();
    res.json(posts);
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPostsByCategory = (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.params;
    const posts = PostModel.findByCategory(category);
    res.json(posts);
  } catch (error) {
    console.error('Get posts by category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPostById = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const post = PostModel.findById(parseInt(id));

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPost = (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    if (!['dynamics', 'study-notes', 'daily-findings'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const post = PostModel.create({
      title,
      content,
      category,
      author_id: req.user!.id
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePost = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    if (category && !['dynamics', 'study-notes', 'daily-findings'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const success = PostModel.update(parseInt(id), { title, content, category });

    if (!success) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updatedPost = PostModel.findById(parseInt(id));
    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePost = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = PostModel.delete(parseInt(id));

    if (!success) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
