import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    customOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomOffer' },
    amount: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    type: { type: String, enum: ['full', 'partial', 'custom_offer'], default: 'full' }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
