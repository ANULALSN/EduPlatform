import Course from '../models/Course.js';
import StudentRequest from '../models/StudentRequest.js';

// Get analytics for a user (student or mentor)
export const getAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.query;

        if (role === 'student') {
            const enrolledCourses = await Course.countDocuments({ enrolledStudents: userId });
            const completedCourses = 0; // Placeholder - would need progress tracking
            const certificates = 0; // Placeholder

            res.json({
                enrolledCourses,
                completedCourses,
                certificates,
                resumeCredits: 3 // Placeholder
            });
        } else if (role === 'tutor') {
            const myCourses = await Course.find({ mentor: userId });
            const courseIds = myCourses.map(c => c._id);

            let totalStudents = 0;
            myCourses.forEach(c => {
                totalStudents += c.enrolledStudents?.length || 0;
            });

            const activeCourses = myCourses.length;
            const pendingRequests = await StudentRequest.countDocuments({ mentor: userId, status: 'pending' });

            res.json({
                totalStudents,
                activeCourses,
                pendingRequests,
                totalEarnings: 0 // Placeholder
            });
        } else {
            res.status(400).json({ message: 'Invalid role' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
