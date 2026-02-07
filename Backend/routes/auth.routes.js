import express from 'express';
import { registerUser, loginUser, validateSession } from '../controllers/auth.controller.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Register route with file upload
router.post('/register', upload.single('avatar'), registerUser);

// Login route
router.post('/login', loginUser);

// Validate session route
router.post('/validate-session', validateSession);

export default router;
