import express from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getAnalytics);

export default router;
