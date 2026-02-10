import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createCustomOffer,
    getOffersForCourse,
    markModuleComplete,
    getMyAccess
} from '../controllers/purchase.controller.js';

const router = express.Router();

router.post('/custom-offer', protect, createCustomOffer);
router.get('/offers/:courseId', protect, getOffersForCourse);
router.post('/complete-module', protect, markModuleComplete);
router.get('/access/:courseId', protect, getMyAccess);

export default router;
