import express from 'express';
import { sendMessage, getChatHistory, getMentors } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/mentors', getMentors);
router.post('/send', sendMessage);
router.get('/history/:userId', getChatHistory);

export default router;
