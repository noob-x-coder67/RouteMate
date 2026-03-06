import { Router } from 'express';
// Use named imports to avoid "undefined" errors
import { login, register } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
// router.get('/me', protect, getMe);

export default router;