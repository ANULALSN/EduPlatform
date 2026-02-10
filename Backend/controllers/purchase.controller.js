import CustomOffer from '../models/CustomOffer.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

// @desc    Tutor creates a custom module offer for a student
// @route   POST /api/purchase/custom-offer
// @access  Private (Tutor)
export const createCustomOffer = async (req, res) => {
    try {
        const { courseId, studentId, moduleIds, price } = req.body;

        // Validate the course belongs to this tutor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.mentor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only create offers for your own courses' });
        }

        // Validate moduleIds exist in the course
        const courseModuleIds = course.modules.map(m => m._id.toString());
        const invalidModules = moduleIds.filter(id => !courseModuleIds.includes(id));
        if (invalidModules.length > 0) {
            return res.status(400).json({ message: 'Some module IDs are invalid' });
        }

        // Check for existing pending offer
        const existingOffer = await CustomOffer.findOne({
            course: courseId,
            student: studentId,
            status: 'pending'
        });
        if (existingOffer) {
            return res.status(400).json({ message: 'A pending offer already exists for this student' });
        }

        const offer = await CustomOffer.create({
            course: courseId,
            tutor: req.user._id,
            student: studentId,
            moduleIds,
            price
        });

        // Notify the student
        const Notification = (await import('../models/Notification.js')).default;
        await Notification.create({
            user: studentId,
            title: 'Custom Course Offer! 🎓',
            message: `${req.user.fullName} has created a custom offer for "${course.title}" — ${moduleIds.length} modules for ₹${price}.`,
            type: 'system',
            link: `/courses/${courseId}`
        });

        res.status(201).json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get custom offers for a student (for a specific course)
// @route   GET /api/purchase/offers/:courseId
// @access  Private
export const getOffersForCourse = async (req, res) => {
    try {
        const offers = await CustomOffer.find({
            course: req.params.courseId,
            student: req.user._id,
            status: 'pending'
        }).populate('tutor', 'fullName avatar');

        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fulfill a custom offer after payment (called by payment verify)
// @route   Internal use
export const fulfillCustomOffer = async (offerId) => {
    const offer = await CustomOffer.findById(offerId);
    if (!offer) throw new Error('Offer not found');

    offer.status = 'paid';
    await offer.save();

    // Add partial access to user's purchasedCourses
    const user = await User.findById(offer.student);
    const existingPurchase = user.purchasedCourses.find(
        p => p.course.toString() === offer.course.toString()
    );

    if (existingPurchase) {
        // Merge newly purchased modules with existing
        offer.moduleIds.forEach(modId => {
            if (!existingPurchase.allowedModules.some(m => m.toString() === modId.toString())) {
                existingPurchase.allowedModules.push(modId);
            }
        });
    } else {
        user.purchasedCourses.push({
            course: offer.course,
            accessType: 'partial',
            allowedModules: offer.moduleIds
        });
    }

    await user.save();

    // Also add student to enrolledStudents if not already
    await Course.findByIdAndUpdate(offer.course, {
        $addToSet: { enrolledStudents: offer.student }
    });

    return offer;
};

// @desc    Mark a module as completed
// @route   POST /api/purchase/complete-module
// @access  Private
export const markModuleComplete = async (req, res) => {
    try {
        const { courseId, moduleId } = req.body;
        const userId = req.user._id;

        // Check if already completed
        const user = await User.findById(userId);
        const alreadyDone = user.completedModules.some(
            cm => cm.course.toString() === courseId && cm.moduleId.toString() === moduleId
        );

        if (alreadyDone) {
            return res.status(400).json({ message: 'Module already completed' });
        }

        user.completedModules.push({ course: courseId, moduleId });
        await user.save();

        res.json({ message: 'Module marked as complete', completedModules: user.completedModules });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's access level for a specific course
// @route   GET /api/purchase/access/:courseId
// @access  Private
export const getMyAccess = async (req, res) => {
    try {
        const userId = req.user._id;
        const courseId = req.params.courseId;

        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is enrolled (full access via enrollment)
        const isEnrolled = course.enrolledStudents.some(s => s.toString() === userId.toString());

        // Check purchased courses for access details
        const purchase = user.purchasedCourses.find(
            p => p.course.toString() === courseId
        );

        // Get completed modules for this course
        const completedModules = user.completedModules
            .filter(cm => cm.course.toString() === courseId)
            .map(cm => cm.moduleId.toString());

        let accessType = 'none';
        let allowedModules = [];

        if (isEnrolled && (!purchase || purchase.accessType === 'full')) {
            accessType = 'full';
            allowedModules = course.modules.map(m => m._id.toString());
        } else if (purchase) {
            accessType = purchase.accessType;
            allowedModules = purchase.allowedModules.map(m => m.toString());
        }

        res.json({
            accessType,
            allowedModules,
            completedModules,
            isEnrolled
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
