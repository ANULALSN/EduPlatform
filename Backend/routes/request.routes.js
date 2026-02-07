import express from 'express';
import { createRequest, getRequestsForMentor, updateRequestStatus, getPendingCount } from '../controllers/request.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRequest);
router.get('/mentor/:mentorId', protect, getRequestsForMentor);
router.get('/mentor/:mentorId/count', protect, getPendingCount);
router.put('/:requestId', protect, updateRequestStatus);

export default router;
