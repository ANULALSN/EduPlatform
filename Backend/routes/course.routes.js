import express from 'express';
import { createCourse, getCourses, getCourseById, enrollCourse, addReview, updateCourse } from '../controllers/course.controller.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/review', protect, addReview);

export default router;
