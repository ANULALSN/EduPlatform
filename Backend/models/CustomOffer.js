import mongoose from 'mongoose';

const customOfferSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    moduleIds: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'expired'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('CustomOffer', customOfferSchema);
