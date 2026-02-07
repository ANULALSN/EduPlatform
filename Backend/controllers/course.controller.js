import Course from '../models/Course.js';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Tutor only)
export const createCourse = async (req, res) => {
    try {
        const { title, description, category, price, thumbnail, modules } = req.body;
        const mentorId = req.body.mentorId; // Should ideally come from req.user (middleware)

        if (!title || !description || !category || !mentorId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newCourse = await Course.create({
            title,
            description,
            category,
            price,
            thumbnail,
            modules,
            mentor: mentorId
        });

        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses (with optional filters)
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
    try {
        const { category, search, mentor, enrolled } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.title = { $regex: new RegExp(search, 'i') };
        }

        if (mentor) {
            query.mentor = mentor;
        }

        if (enrolled) {
            query.enrolledStudents = enrolled;
        }

        const courses = await Course.find(query)
            .populate('mentor', 'fullName avatar')
            .sort({ createdAt: -1 });

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('mentor', 'fullName avatar')
            .populate('enrolledStudents', 'fullName avatar'); // For mentor view

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { studentId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.enrolledStudents.includes(studentId)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        course.enrolledStudents.push(studentId);
        await course.save();

        res.json({ message: 'Enrolled successfully', courseId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a review to a course
// @route   POST /api/courses/:id/review
// @access  Private
export const addReview = async (req, res) => {
    try {
        const { rating, review, studentId } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if already reviewed
        const alreadyReviewed = course.ratings.find(r => r.student.toString() === studentId);
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const reviewData = {
            student: studentId,
            rating: Number(rating),
            review
        };

        course.ratings.push(reviewData);
        await course.save();

        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Mentor only)
export const updateCourse = async (req, res) => {
    try {
        const { title, description, category, price, thumbnail, modules } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.title = title || course.title;
        course.description = description || course.description;
        course.category = category || course.category;
        course.price = price !== undefined ? price : course.price;
        course.thumbnail = thumbnail || course.thumbnail;
        course.modules = modules || course.modules;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
