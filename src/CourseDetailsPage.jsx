import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Play, Lock, CheckCircle, Star, ShoppingCart, CreditCard, Award } from "lucide-react";
import API_URL from "./config";

const CourseDetailsPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [user, setUser] = useState(null);

    // Flexi-Learn state
    const [accessType, setAccessType] = useState("none");
    const [allowedModules, setAllowedModules] = useState([]);
    const [completedModules, setCompletedModules] = useState([]);

    // Review state
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, review: "" });
    const [hasReviewed, setHasReviewed] = useState(false);

    // Payment state
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        fetchCourse(userInfo?._id);
        if (userInfo?._id) {
            fetchAccess(userInfo);
        }
    }, [id]);

    const fetchCourse = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/courses/${id}`);
            if (response.ok) {
                const data = await response.json();
                setCourse(data);

                if (userId && data.enrolledStudents.some(s => s._id === userId || s === userId)) {
                    setIsEnrolled(true);
                }

                // Check if user already reviewed
                if (userId && data.ratings?.some(r => r.student === userId || r.student?._id === userId)) {
                    setHasReviewed(true);
                }

                if (data.modules?.length > 0 && data.modules[0].videos?.length > 0) {
                    setActiveVideo(data.modules[0].videos[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch course", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAccess = async (userInfo) => {
        try {
            const response = await fetch(`${API_URL}/purchase/access/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAccessType(data.accessType);
                setAllowedModules(data.allowedModules);
                setCompletedModules(data.completedModules);
                if (data.isEnrolled) setIsEnrolled(true);
            }
        } catch (error) {
            console.error("Failed to fetch access", error);
        }
    };

    // === MODULE ACCESS LOGIC ===
    const isModuleAccessible = (module, moduleIndex) => {
        if (!isEnrolled && accessType === "none") return false;

        // Full access: check sequential lock
        if (accessType === "full" || isEnrolled) {
            if (moduleIndex === 0) return true;
            // Previous module must be completed
            const prevModule = course.modules[moduleIndex - 1];
            return completedModules.includes(prevModule._id);
        }

        // Partial access: module must be in allowedModules AND sequential
        if (accessType === "partial") {
            if (!allowedModules.includes(module._id)) return false;
            if (moduleIndex === 0) return true;

            // Find previous allowed module
            for (let i = moduleIndex - 1; i >= 0; i--) {
                if (allowedModules.includes(course.modules[i]._id)) {
                    return completedModules.includes(course.modules[i]._id);
                }
            }
            return true;
        }

        return false;
    };

    const isModuleCompleted = (moduleId) => completedModules.includes(moduleId);

    const isModulePurchased = (moduleId) => {
        if (accessType === "full" || isEnrolled) return true;
        return allowedModules.includes(moduleId);
    };

    const handleMarkComplete = async (moduleId) => {
        try {
            const response = await fetch(`${API_URL}/purchase/complete-module`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ courseId: id, moduleId })
            });
            if (response.ok) {
                const data = await response.json();
                setCompletedModules(data.completedModules.filter(cm => cm.course === id).map(cm => cm.moduleId));

                // Check if all modules completed — prompt review
                const allModuleIds = course.modules.map(m => m._id);
                const allAccessible = accessType === "full" || isEnrolled
                    ? allModuleIds
                    : allowedModules;
                const allCompleted = allAccessible.every(mId =>
                    [...completedModules, moduleId].includes(mId)
                );
                if (allCompleted && !hasReviewed) {
                    setTimeout(() => setShowReviewModal(true), 500);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    // === RAZORPAY PAYMENT ===
    const handlePayment = async () => {
        if (!user) {
            alert("Please login to purchase");
            return;
        }
        setPaying(true);

        try {
            // 1. Create order
            const orderRes = await fetch(`${API_URL}/payment/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ courseId: id })
            });

            const orderData = await orderRes.json();

            // Free course — enrolled directly
            if (orderData.free) {
                alert("Enrolled Successfully! (Free Course)");
                setIsEnrolled(true);
                setAccessType("full");
                setPaying(false);
                return;
            }

            // 2. Open Razorpay checkout
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "EduConnect",
                description: course.title,
                order_id: orderData.orderId,
                handler: async (response) => {
                    // 3. Verify payment
                    try {
                        const verifyRes = await fetch(`${API_URL}/payment/verify`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${user.token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        if (verifyRes.ok) {
                            alert("Payment Successful! You now have full access.");
                            setIsEnrolled(true);
                            setAccessType("full");
                            fetchAccess(user);
                        } else {
                            alert("Payment verification failed. Contact support.");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Verification error.");
                    }
                    setPaying(false);
                },
                prefill: {
                    name: user.fullName,
                    email: user.email
                },
                theme: { color: "#a855f7" },
                modal: {
                    ondismiss: () => setPaying(false)
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error(error);
            alert("Payment failed. Please try again.");
            setPaying(false);
        }
    };

    // === REVIEW ===
    const handleReviewSubmit = async () => {
        try {
            const response = await fetch(`${API_URL}/courses/${id}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ ...reviewData, studentId: user._id })
            });

            if (response.ok) {
                alert("Review Submitted! Thank you.");
                setShowReviewModal(false);
                setHasReviewed(true);
            } else {
                const data = await response.json();
                alert(data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!course) return <div className="text-white p-10">Course not found</div>;

    // Compute average rating from course ratings
    const avgRating = course.ratings?.length > 0
        ? (course.ratings.reduce((sum, r) => sum + r.rating, 0) / course.ratings.length).toFixed(1)
        : "N/A";

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans relative">
            {/* Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

            {/* Header */}
            <header className="bg-slate-800/50 border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link to="/courses" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-bold text-lg truncate max-w-md">{course.title}</h1>
                    {course.status && course.status !== "approved" && (
                        <span className={`text-xs px-2 py-1 rounded-full ${course.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                            {course.status}
                        </span>
                    )}
                </div>
                {!isEnrolled && accessType === "none" && (
                    <button
                        onClick={handlePayment}
                        disabled={paying}
                        className="px-6 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-lg font-bold shadow-lg shadow-fuchsia-900/30 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {paying ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <CreditCard className="w-4 h-4" />
                        )}
                        {course.price > 0 ? `Buy Now - ₹${course.price}` : "Enroll Free"}
                    </button>
                )}
                {isEnrolled && (
                    <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Enrolled
                    </span>
                )}
            </header>

            <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
                {/* Video Player Area */}
                <div className="flex-1 bg-black flex flex-col overflow-y-auto">
                    <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                        {(isEnrolled || accessType !== "none") ? (
                            activeVideo?.url ? (
                                <iframe
                                    src={activeVideo.url.replace("youtu.be/", "youtube.com/embed/").replace("watch?v=", "embed/")}
                                    title={activeVideo.title}
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="text-slate-500">Select a video to play</div>
                            )
                        ) : (
                            <div className="text-center p-6">
                                <Lock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Content Locked</h3>
                                <p className="text-slate-400 mb-4">Purchase this course to access the content.</p>
                                <button
                                    onClick={handlePayment}
                                    disabled={paying}
                                    className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 mx-auto"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    {course.price > 0 ? `Buy Now - ₹${course.price}` : "Enroll Free"}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-2">{activeVideo?.title || course.title}</h2>
                        <div className="flex items-center gap-4 mb-6 text-sm text-slate-400">
                            <span>{course.category}</span>
                            <span>•</span>
                            <span>{course.modules.reduce((acc, m) => acc + m.videos.length, 0)} Lessons</span>
                            <span>•</span>
                            <div className="flex items-center gap-1 text-amber-400">
                                <Star className="w-4 h-4 fill-current" />
                                <span>{avgRating} ({course.ratings?.length || 0} reviews)</span>
                            </div>
                        </div>

                        <div className="bg-slate-800/30 rounded-xl p-6 border border-white/5">
                            <h3 className="font-bold mb-2">About this course</h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{course.description}</p>
                        </div>

                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={course.mentor.avatar || `https://ui-avatars.com/api/?name=${course.mentor.fullName}`}
                                    alt={course.mentor.fullName}
                                    className="w-12 h-12 rounded-full border-2 border-fuchsia-500/30"
                                />
                                <div>
                                    <div className="text-xs text-slate-400">Instructor</div>
                                    <div className="font-bold">{course.mentor.fullName}</div>
                                    {course.mentor.averageRating > 0 && (
                                        <div className="flex items-center gap-1 text-xs text-amber-400">
                                            <Star className="w-3 h-3 fill-current" />
                                            {course.mentor.averageRating} avg rating
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isEnrolled && !hasReviewed && (
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className="ml-auto px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-fuchsia-400 border border-fuchsia-500/30 flex items-center gap-2"
                                >
                                    <Award className="w-4 h-4" /> Write a Review
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Playlist Sidebar with Module Locking */}
                <div className="w-full lg:w-96 bg-slate-900 border-l border-white/5 flex flex-col">
                    <div className="p-4 border-b border-white/5 font-bold text-lg flex items-center justify-between">
                        <span>Course Content</span>
                        {accessType === "partial" && (
                            <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">Partial Access</span>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {course.modules.map((module, mIdx) => {
                            const accessible = isModuleAccessible(module, mIdx);
                            const purchased = isModulePurchased(module._id);
                            const completed = isModuleCompleted(module._id);

                            return (
                                <div key={mIdx} className={`rounded-xl overflow-hidden border transition-colors ${completed
                                    ? 'bg-emerald-900/10 border-emerald-500/20'
                                    : accessible
                                        ? 'bg-slate-800/40 border-white/5'
                                        : 'bg-slate-800/20 border-white/5 opacity-60'
                                    }`}>
                                    <div className="p-4 bg-white/5 font-semibold text-sm flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            {completed ? (
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                            ) : !purchased ? (
                                                <Lock className="w-4 h-4 text-slate-500" />
                                            ) : !accessible ? (
                                                <Lock className="w-4 h-4 text-amber-400" />
                                            ) : null}
                                            <span className={!purchased ? 'text-slate-500' : ''}>{module.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!purchased && (
                                                <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">LOCKED</span>
                                            )}
                                            {!accessible && purchased && !completed && (
                                                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">COMPLETE PREV</span>
                                            )}
                                            <span className="text-xs text-slate-500">{module.videos.length} videos</span>
                                        </div>
                                    </div>
                                    <div>
                                        {module.videos.map((video, vIdx) => (
                                            <button
                                                key={vIdx}
                                                onClick={() => accessible && setActiveVideo(video)}
                                                disabled={!accessible}
                                                className={`w-full text-left p-3 flex items-start gap-3 transition-colors ${activeVideo === video ? "bg-fuchsia-900/20 text-fuchsia-400 border-l-2 border-fuchsia-500" : "hover:bg-white/5 text-slate-400"
                                                    } ${!accessible ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                <div className="mt-1">
                                                    {accessible && activeVideo === video ? (
                                                        <Play className="w-3 h-3 fill-current" />
                                                    ) : accessible ? (
                                                        <CheckCircle className="w-3 h-3" />
                                                    ) : (
                                                        <Lock className="w-3 h-3" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium line-clamp-1">{video.title}</div>
                                                    <div className="text-xs opacity-60">{video.duration || "5:00"}</div>
                                                </div>
                                            </button>
                                        ))}

                                        {/* Mark Complete button */}
                                        {accessible && !completed && (
                                            <button
                                                onClick={() => handleMarkComplete(module._id)}
                                                className="w-full p-2 text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-1 border-t border-white/5"
                                            >
                                                <CheckCircle className="w-3 h-3" /> Mark Module Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-1">How was your experience?</h3>
                        <p className="text-sm text-slate-400 mb-4">Rate your experience with <strong className="text-white">{course.mentor?.fullName}</strong></p>

                        <div className="flex gap-2 mb-6 justify-center">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setReviewData({ ...reviewData, rating: star })} className="transition-transform hover:scale-110">
                                    <Star className={`w-10 h-10 ${star <= reviewData.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={reviewData.review}
                            onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500 mb-6 h-32 resize-none"
                            placeholder="Share your experience..."
                        ></textarea>

                        <div className="flex gap-3">
                            <button onClick={() => setShowReviewModal(false)} className="flex-1 py-3 bg-white/5 rounded-xl hover:bg-white/10 text-sm font-bold">Cancel</button>
                            <button onClick={handleReviewSubmit} className="flex-1 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl hover:from-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-fuchsia-900/20">Submit Review</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetailsPage;
