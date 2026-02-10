import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from '../models/Transaction.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { fulfillCustomOffer } from './purchase.controller.js';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// @desc    Get Razorpay public key
// @route   GET /api/payment/key
// @access  Public
export const getRazorpayKey = (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
};

// @desc    Create a Razorpay order
// @route   POST /api/payment/order
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { courseId, customOfferId } = req.body;
        const userId = req.user._id;

        let amount = 0;
        let type = 'full';

        if (customOfferId) {
            // Custom offer purchase (Flexi-Learn)
            const CustomOffer = (await import('../models/CustomOffer.js')).default;
            const offer = await CustomOffer.findById(customOfferId);
            if (!offer || offer.status !== 'pending') {
                return res.status(400).json({ message: 'Invalid or expired offer' });
            }
            amount = offer.price;
            type = 'custom_offer';
        } else if (courseId) {
            // Full course purchase
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            amount = course.price;
            type = 'full';
        } else {
            return res.status(400).json({ message: 'Provide courseId or customOfferId' });
        }

        // Free course — enroll directly
        if (amount === 0) {
            if (courseId) {
                await Course.findByIdAndUpdate(courseId, {
                    $addToSet: { enrolledStudents: userId }
                });

                const user = await User.findById(userId);
                user.purchasedCourses.push({
                    course: courseId,
                    accessType: 'full',
                    allowedModules: []
                });
                await user.save();
            }
            return res.json({ free: true, message: 'Enrolled successfully (free course)' });
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Razorpay uses paise
            currency: 'INR',
            receipt: `order_${Date.now()}_${userId}`
        };

        const order = await razorpay.orders.create(options);

        // Save transaction as pending
        await Transaction.create({
            student: userId,
            course: courseId || null,
            customOffer: customOfferId || null,
            amount,
            razorpayOrderId: order.id,
            status: 'pending',
            type
        });

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Payment order error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify payment after Razorpay checkout
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user._id;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            // Update transaction as failed
            await Transaction.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'failed' }
            );
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Update transaction to completed
        const transaction = await Transaction.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: 'completed'
            },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // === FULFILLMENT ===
        if (transaction.type === 'custom_offer' && transaction.customOffer) {
            // Flexi-Learn: Fulfill custom offer (partial access)
            await fulfillCustomOffer(transaction.customOffer);
        } else if (transaction.course) {
            // Full course purchase: Enroll student
            await Course.findByIdAndUpdate(transaction.course, {
                $addToSet: { enrolledStudents: userId }
            });

            const user = await User.findById(userId);
            const alreadyPurchased = user.purchasedCourses.some(
                p => p.course.toString() === transaction.course.toString()
            );

            if (!alreadyPurchased) {
                user.purchasedCourses.push({
                    course: transaction.course,
                    accessType: 'full',
                    allowedModules: []
                });
                await user.save();
            }
        }

        // Notify student
        await Notification.create({
            user: userId,
            title: 'Payment Successful! ✅',
            message: `Your payment of ₹${transaction.amount} was successful. You now have access to the course.`,
            type: 'payment',
            link: transaction.course ? `/courses/${transaction.course}` : '/my-courses'
        });

        res.json({ success: true, message: 'Payment verified and course access granted', transaction });
    } catch (error) {
        console.error('Payment verify error:', error);
        res.status(500).json({ message: error.message });
    }
};
