import express from 'express';
import { createPost, getAllBlogs, getBlogById, getMyBlogs, updateBlog, deleteBlog } from '../controllers/blogController';
import  authenticateToken from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, createPost);
router.get('/list', getAllBlogs);
router.get('/:id', getBlogById);
router.put('/:id', authenticateToken, updateBlog);
router.delete('/:id', authenticateToken, deleteBlog);
router.get('/',authenticateToken, getMyBlogs);

export default router;
