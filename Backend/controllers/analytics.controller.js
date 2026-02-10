import Course from '../models/Course.js';
import StudentRequest from '../models/StudentRequest.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

// Get analytics for a user (student or mentor)
export const getAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.query;

        if (role === 'student') {
            const enrolledCourses = await Course.countDocuments({ enrolledStudents: userId });

            // Count unique courses where user has at least 1 completed module
            const userData = await User.findById(userId).select('completedModules');
            const completedCourseIds = new Set(
                (userData?.completedModules || []).map(cm => cm.course.toString())
            );

            res.json({
                enrolledCourses,
                completedCourses: completedCourseIds.size,
                certificates: 0,
                resumeCredits: 3
            });
        } else if (role === 'tutor') {
            const myCourses = await Course.find({ mentor: userId });
            const courseIds = myCourses.map(c => c._id);

            let totalStudents = 0;
            myCourses.forEach(c => {
                totalStudents += c.enrolledStudents?.length || 0;
            });

            const activeCourses = myCourses.filter(c => c.status === 'approved').length;
            const pendingRequests = await StudentRequest.countDocuments({ mentor: userId, status: 'pending' });

            // Real earnings from transactions
            const earnings = await Transaction.aggregate([
                { $match: { course: { $in: courseIds }, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            res.json({
                totalStudents,
                activeCourses,
                pendingRequests,
                totalEarnings: earnings[0]?.total || 0
            });
        } else {
            res.status(400).json({ message: 'Invalid role' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

