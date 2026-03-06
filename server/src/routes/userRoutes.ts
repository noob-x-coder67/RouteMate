import express from 'express';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// This route is now PROTECTED
router.get('/me', protect, (req: any, res) => {
    res.status(200).json({
        status: 'success',
        message: 'You have accessed a protected route!',
        userId: req.user.id
    });
});

export default router;