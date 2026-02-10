import Notification from '../models/Notification.js';

// @desc    Get all notifications for a user
// @route   GET /api/notifications/:userId
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({ user: req.params.userId, read: false });

        res.json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:notifId/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.notifId, { read: true });
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/:userId/read-all
// @access  Private
export const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.params.userId, read: false }, { read: true });
        res.json({ message: 'All marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
