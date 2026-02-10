import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getRazorpayKey, createOrder, verifyPayment } from '../controllers/payment.controller.js';

const router = express.Router();

router.get('/key', getRazorpayKey);
router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;
