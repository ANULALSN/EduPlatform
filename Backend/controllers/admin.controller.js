import User from '../models/User.js';
import Course from '../models/Course.js';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';

// @desc    Get admin dashboard KPI stats
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = async (req, res) => {
    try {
        // Total counts
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTutors = await User.countDocuments({ role: 'tutor' });
        const activeCourses = await Course.countDocuments({ status: 'approved' });
        const pendingCourses = await Course.countDocuments({ status: 'pending' });

        // Total revenue from completed transactions
        const revenueAgg = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

        // Signups per month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const signupsPerMonth = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo }, role: { $ne: 'admin' } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Revenue per month (last 6 months)
        const revenuePerMonth = await Transaction.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Format for recharts
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const signupsChart = signupsPerMonth.map(s => ({
            month: `${monthNames[s._id.month - 1]} ${s._id.year}`,
            signups: s.count
        }));

        const revenueChart = revenuePerMonth.map(r => ({
            month: `${monthNames[r._id.month - 1]} ${r._id.year}`,
            revenue: r.revenue
        }));

        res.json({
            totalUsers,
            totalStudents,
            totalTutors,
            activeCourses,
            pendingCourses,
            totalRevenue,
            signupsChart,
            revenueChart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (paginated)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        let query = { role: { $ne: 'admin' } };

        if (search) {
            query.$or = [
                { fullName: { $regex: new RegExp(search, 'i') } },
                { email: { $regex: new RegExp(search, 'i') } }
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password -sessions')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle ban/unban user
// @route   PUT /api/admin/users/:userId/ban
// @access  Admin
export const toggleBanUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isBanned = !user.isBanned;

        // If banning, clear their sessions to force logout
        if (user.isBanned) {
            user.sessions = [];
        }

        await user.save();

        res.json({ message: user.isBanned ? 'User banned' : 'User unbanned', isBanned: user.isBanned });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get ALL courses (all statuses)
// @route   GET /api/admin/courses
// @access  Admin
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('mentor', 'fullName email avatar')
            .sort({ createdAt: -1 });

        res.json({ courses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a course
// @route   PUT /api/admin/courses/:courseId/approve
// @access  Admin
export const approveCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.courseId,
            { status: 'approved' },
            { new: true }
        ).populate('mentor', 'fullName email');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Create notification for the tutor
        const Notification = (await import('../models/Notification.js')).default;
        await Notification.create({
            user: course.mentor._id,
            title: 'Course Approved!',
            message: `Your course "${course.title}" has been approved and is now live.`,
            type: 'course_approved',
            link: `/courses/${course._id}`
        });

        res.json({ message: 'Course approved', course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject a course
// @route   PUT /api/admin/courses/:courseId/reject
// @access  Admin
export const rejectCourse = async (req, res) => {
    try {
        const { reason } = req.body;

        const course = await Course.findByIdAndUpdate(
            req.params.courseId,
            { status: 'rejected' },
            { new: true }
        ).populate('mentor', 'fullName email');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const Notification = (await import('../models/Notification.js')).default;
        await Notification.create({
            user: course.mentor._id,
            title: 'Course Rejected',
            message: `Your course "${course.title}" was rejected. ${reason ? `Reason: ${reason}` : 'Please review and resubmit.'}`,
            type: 'course_rejected',
            link: `/edit-course/${course._id}`
        });

        res.json({ message: 'Course rejected', course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all transactions (paginated, with summary)
// @route   GET /api/admin/transactions
// @access  Admin
export const getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 12, search = '' } = req.query;

        let matchStage = {};
        if (search) {
            // We'll filter after population
        }

        const total = await Transaction.countDocuments();
        const transactions = await Transaction.find()
            .populate('student', 'fullName email avatar')
            .populate('course', 'title')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Summary
        const summaryAgg = await Transaction.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    amount: { $sum: '$amount' }
                }
            }
        ]);

        const summary = { total: 0, completed: 0, failed: 0, pending: 0 };
        summaryAgg.forEach(s => {
            if (s._id === 'completed') {
                summary.total = s.amount;
                summary.completed = s.count;
            } else if (s._id === 'failed') {
                summary.failed = s.count;
            } else {
                summary.pending += s.count;
            }
        });

        res.json({
            transactions,
            totalPages: Math.ceil(total / limit),
            page: parseInt(page),
            summary
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Category CRUD
// @access  Admin

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: 'Category name is required' });

        const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (exists) return res.status(400).json({ message: 'Category already exists' });

        const category = await Category.create({ name, description });
        res.status(201).json({ category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

