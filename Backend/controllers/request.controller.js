import StudentRequest from '../models/StudentRequest.js';

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

// Update request status (accept/reject)
export const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const request = await StudentRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        ).populate('student', 'fullName email avatar');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json(request);
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
