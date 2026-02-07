import express from 'express';
import { updateUserProfile } from '../controllers/user.controller.js';
import { upload } from '../config/cloudinary.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Update profile route
router.put('/profile/:id', protect, upload.single('avatar'), updateUserProfile);

export default router;
