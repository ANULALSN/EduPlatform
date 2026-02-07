import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: String } // e.g., "10:30"
});

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videos: [videoSchema]
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String }, // URL
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    modules: [moduleSchema],
    ratings: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String }
    }]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
