import { Router } from 'express';
import {
  getAllPosts,
  getPostsByCategory,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController';
import { getCommentsByPostId, createComment } from '../controllers/commentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/posts', getAllPosts);
router.get('/posts/category/:category', getPostsByCategory);
router.get('/posts/:id', getPostById);
router.get('/posts/:id/comments', getCommentsByPostId);
router.post('/posts/:id/comments', createComment);

// Protected routes (admin only)
router.post('/posts', authMiddleware, createPost);
router.put('/posts/:id', authMiddleware, updatePost);
router.delete('/posts/:id', authMiddleware, deletePost);

export default router;
