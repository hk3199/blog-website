import express, { Request, Response } from 'express';
import { signupUser, loginUser, updateUserProfile, getProfile } from '../controllers/userController';
import authenticateToken from '../middleware/auth.middleware';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateUserProfile);

export default router;
