import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    role: { type: String, required: true, enum: ['student', 'tutor'] },
    interests: [{ type: String }],
    avatar: { type: String },
    sessions: [{
        deviceType: { type: String, required: true, enum: ['phone', 'laptop'] },
        token: { type: String, required: true },
        lastLogin: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
