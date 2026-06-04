import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { createPost, getPostsByUser, deletePost } from '../models/post';

const router = Router();

// All routes protected
router.use(protect);

// GET all posts for logged in user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const posts = await getPostsByUser(req.userId!);
    res.json({ posts });
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE a new post
router.post('/', async (req: AuthRequest, res: Response) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category)
    return res.status(400).json({ error: 'Title, content and category are required' });

  try {
    const post = await createPost(req.userId!, title, content, category);
    res.status(201).json({ post });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a post
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const postId = String(req.params.id);
    await deletePost(req.userId!, postId);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;