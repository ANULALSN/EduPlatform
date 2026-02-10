import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
    getDashboardStats,
    getAllUsers,
    toggleBanUser,
    getAllCourses,
    approveCourse,
    rejectCourse,
    getTransactions,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/stats', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.put('/users/:userId/ban', toggleBanUser);

// Courses
router.get('/courses', getAllCourses);
router.put('/courses/:courseId/approve', approveCourse);
router.put('/courses/:courseId/reject', rejectCourse);

// Transactions
router.get('/transactions', getTransactions);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
