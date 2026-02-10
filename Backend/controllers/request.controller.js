import StudentRequest from '../models/StudentRequest.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Notification from '../models/Notification.js';

// Create a new student request
export const createRequest = async (req, res) => {
    try {
        const { studentId, mentorId, courseId, message } = req.body;

        const existingRequest = await StudentRequest.findOne({
            student: studentId,
            mentor: mentorId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending request to this mentor' });
        }

        const request = await StudentRequest.create({
            student: studentId,
            mentor: mentorId,
            course: courseId,
            message
        });

        // Notify the mentor about the new request
        const student = await User.findById(studentId).select('fullName');
        await Notification.create({
            user: mentorId,
            title: 'New Mentorship Request',
            message: `${student?.fullName || 'A student'} has requested mentorship from you.`,
            type: 'system',
            link: '/student-requests'
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all requests for a mentor
export const getRequestsForMentor = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const { status } = req.query;

        let query = { mentor: mentorId };
        if (status) query.status = status;

        const requests = await StudentRequest.find(query)
            .populate('student', 'fullName email avatar')
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update request status (accept/reject) — FULL WORKFLOW
export const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const request = await StudentRequest.findById(requestId)
            .populate('student', 'fullName email avatar')
            .populate('mentor', 'fullName meetingLink');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;

        if (status === 'accepted') {
            // 1. Auto-enroll student in course (if courseId exists)
            if (request.course) {
                await Course.findByIdAndUpdate(request.course, {
                    $addToSet: { enrolledStudents: request.student._id }
                });
            }

            // 2. Get meeting link from tutor profile
            const meetingLink = request.mentor?.meetingLink || '';

            // 3. Create notification for student
            await Notification.create({
                user: request.student._id,
                title: 'Session Confirmed! 🎉',
                message: `Your mentorship request to ${request.mentor?.fullName} has been accepted.${meetingLink ? ` Meeting link: ${meetingLink}` : ''}`,
                type: 'request_accepted',
                link: `/chat?mentor=${request.mentor._id}`
            });
        } else if (status === 'rejected') {
            await Notification.create({
                user: request.student._id,
                title: 'Request Update',
                message: `Your mentorship request was declined by ${request.mentor?.fullName}. You can try other mentors.`,
                type: 'request_rejected',
                link: '/mentors'
            });
        }

        await request.save();

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get requests by student
export const getRequestsForStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const requests = await StudentRequest.find({ student: studentId })
            .populate('mentor', 'fullName avatar');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get pending requests count for a mentor
export const getPendingCount = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const count = await StudentRequest.countDocuments({ mentor: mentorId, status: 'pending' });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
