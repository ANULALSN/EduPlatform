import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getNotifications, markAsRead, markAllRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/:userId', protect, getNotifications);
router.put('/:notifId/read', protect, markAsRead);
router.put('/:userId/read-all', protect, markAllRead);

export default router;
