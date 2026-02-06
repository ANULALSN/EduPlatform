import express from 'express';
import { updateUserProfile } from '../controllers/user.controller.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Update profile route (ID in params for simplicity now)
router.put('/profile/:id', upload.single('avatar'), updateUserProfile);

export default router;
