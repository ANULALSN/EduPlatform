import express from 'express';
import { sendMessage, getChatHistory, getContacts } from '../controllers/chat.controller.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply middleware to all chat routes
router.get('/contacts', protect, getContacts);
router.post('/send', protect, sendMessage);
router.get('/history/:userId', protect, getChatHistory);

export default router;
