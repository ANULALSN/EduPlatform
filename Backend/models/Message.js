import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array for broadcast
    content: { type: String, required: true },
    type: { type: String, enum: ['direct', 'broadcast'], default: 'direct' },
    techStack: { type: String }, // For broadcast context (e.g., "MERN", "Java")
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
