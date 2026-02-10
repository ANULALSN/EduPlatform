import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    role: { type: String, required: true, enum: ['student', 'tutor', 'admin'] },
    interests: [{ type: String }],
    avatar: { type: String },
    isBanned: { type: Boolean, default: false },

    // Tutor-specific
    meetingLink: { type: String, default: '' },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    // Flexi-Learn: Partial course access
    purchasedCourses: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        accessType: { type: String, enum: ['full', 'partial'], default: 'full' },
        allowedModules: [{ type: mongoose.Schema.Types.ObjectId }],
        purchasedAt: { type: Date, default: Date.now }
    }],

    // Module completion tracking (sequential unlock)
    completedModules: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        moduleId: { type: mongoose.Schema.Types.ObjectId },
        completedAt: { type: Date, default: Date.now }
    }],

    // Session management (1-device rule)
    sessions: [{
        deviceType: { type: String, required: true, enum: ['phone', 'laptop'] },
        token: { type: String, required: true },
        lastLogin: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
