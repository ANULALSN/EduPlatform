import User from '../models/User.js';
import Message from '../models/Message.js';

// @desc    Get all mentors (optionally filter by skill/interest)
// @route   GET /api/chat/mentors
// @access  Public (or Private)
export const getMentors = async (req, res) => {
    try {
        const { skill, search } = req.query;
        let query = { role: 'tutor' };

        if (skill) {
            // Case insensitive match for interests (expertises)
            query.interests = { $regex: new RegExp(skill, 'i') };
        }

        if (search) {
            query.fullName = { $regex: new RegExp(search, 'i') };
        }

        const mentors = await User.find(query).select('-password -sessions');
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message (Direct or Broadcast)
// @route   POST /api/chat/send
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content, type, techStack } = req.body;

        if (!content || !senderId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let receivers = [];

        if (type === 'broadcast') {
            // Find all mentors with the specific tech stack
            if (!techStack) {
                return res.status(400).json({ message: 'Tech stack required for broadcast' });
            }

            // Find mentors who have this skill in their interests
            const mentors = await User.find({
                role: 'tutor',
                interests: { $regex: new RegExp(techStack, 'i') }
            });

            receivers = mentors.map(m => m._id);

            if (receivers.length === 0) {
                return res.status(404).json({ message: `No mentors found for ${techStack}` });
            }

        } else {
            // Direct message
            if (!receiverId) {
                return res.status(400).json({ message: 'Receiver ID required for direct message' });
            }
            receivers = [receiverId];
        }

        const newMessage = await Message.create({
            sender: senderId,
            receivers,
            content,
            type,
            techStack
        });

        // Populate sender details for immediate frontend display
        const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'fullName avatar');

        res.status(201).json(populatedMessage);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get chat history between two users or for a user
// @route   GET /api/chat/history/:userId
// @access  Private
export const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params; // The current logged in user
        const { otherUserId } = req.query; // The person they are chatting with

        let query;

        if (otherUserId) {
            // Get conversation between two specific people
            // Messages where (Sender = User AND Receiver = Other) OR (Sender = Other AND Receiver = User)
            query = {
                $or: [
                    { sender: userId, receivers: { $in: [otherUserId] } },
                    { sender: otherUserId, receivers: { $in: [userId] } }
                ]
            };
        } else {
            // Just get all messages involving this user (for inbox list)
            // This is a bit complex for a simple inbox query, usually we aggregate.
            // For now, let's return all messages where user is sender or receiver.
            query = {
                $or: [
                    { sender: userId },
                    { receivers: { $in: [userId] } }
                ]
            };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: 1 })
            .populate('sender', 'fullName avatar')
            .populate('receivers', 'fullName avatar');

        res.json(messages);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
