import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { upload } from '../config/cloudinary.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, mobile, password, gender, role, interests } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Get avatar URL from Cloudinary (if uploaded)
        const avatar = req.file ? req.file.path : '';

        // Parse interests if it's sent as a JSON string (Multipart form data quirks)
        let parsedInterests = interests;
        if (typeof interests === 'string') {
            try {
                parsedInterests = JSON.parse(interests);
            } catch (e) {
                parsedInterests = interests.split(',');
            }
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            mobile,
            password: hashedPassword,
            gender,
            role,
            interests: parsedInterests,
            avatar
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                mobile: user.mobile,
                gender: user.gender,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password, deviceType } = req.body;

        // Validation
        if (!email || !password || !deviceType) {
            return res.status(400).json({ message: 'Please provide email, password and device type' });
        }

        if (!['phone', 'laptop'].includes(deviceType)) {
            return res.status(400).json({ message: 'Invalid device type. Must be phone or laptop.' });
        }

        // Check for user
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user.id);

            // --- Session Management Logic ---
            // 1. Remove any existing session for THIS device type
            let currentSessions = user.sessions || [];
            currentSessions = currentSessions.filter(session => session.deviceType !== deviceType);

            // 2. Add the new session
            currentSessions.push({
                deviceType,
                token,
                lastLogin: new Date()
            });

            // 3. Update user sessions
            user.sessions = currentSessions;
            await user.save();

            res.json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                mobile: user.mobile,
                gender: user.gender,
                role: user.role,
                avatar: user.avatar,
                token,
                sessions: user.sessions // Optional: for debugging
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate current session
// @route   POST /api/auth/validate-session
// @access  Private (requires token)
export const validateSession = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ valid: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ valid: false, message: 'User not found' });
        }

        // Check if token exists in active sessions
        const sessionExists = user.sessions && user.sessions.some(session => session.token === token);

        if (!sessionExists) {
            return res.status(401).json({
                valid: false,
                message: 'Session expired. You have been logged in from another device.'
            });
        }

        res.json({ valid: true, user: { _id: user._id, fullName: user.fullName, role: user.role } });
    } catch (error) {
        console.error("Session Validation Error:", error);
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
};
