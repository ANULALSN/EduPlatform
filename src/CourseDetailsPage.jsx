import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Play, Lock, CheckCircle, Star } from "lucide-react";
import API_URL from "./config";

const CourseDetailsPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        fetchCourse(userInfo?._id);
    }, [id]);

    const fetchCourse = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/courses/${id}`);
            if (response.ok) {
                const data = await response.json();
                setCourse(data);

                // Check enrollment
                if (userId && data.enrolledStudents.some(s => s._id === userId || s === userId)) {
                    setIsEnrolled(true);
                }

                // Set initial video
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

    const handleEnroll = async () => {
        if (!user) {
            alert("Please login to enroll");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/courses/${id}/enroll`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: user._id })
            });

            if (response.ok) {
                alert("Enrolled Successfully!");
                setIsEnrolled(true);
            } else {
                alert("Enrollment Failed");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, review: "" });

    const handleReviewSubmit = async () => {
        try {
            const response = await fetch(`${API_URL}/courses/${id}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...reviewData, studentId: user._id })
            });

            if (response.ok) {
                alert("Review Submitted!");
                setShowReviewModal(false);
                // Refresh course data to show new rating interaction if we were showing it
            } else {
                const data = await response.json();
                alert(data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-white p-10">Loading...</div>;
    if (!course) return <div className="text-white p-10">Course not found</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans relative">
            {/* Header */}
            <header className="bg-slate-800/50 border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link to="/courses" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-bold text-lg truncate max-w-md">{course.title}</h1>
                </div>
                {!isEnrolled && (
                    <button
                        onClick={handleEnroll}
                        className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-bold shadow-lg shadow-fuchsia-900/20 transition-all"
                    >
                        Enroll Now - ₹{course.price}
                    </button>
                )}
            </header>

            <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
                {/* Video Player Area */}
                <div className="flex-1 bg-black flex flex-col overflow-y-auto">
                    <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                        {isEnrolled ? (
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
                                <p className="text-slate-400">Enroll in this course to access the content.</p>
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
                                <span>4.8 (User Reviews)</span>
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
                                </div>
                            </div>

                            {isEnrolled && (
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className="ml-auto px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-fuchsia-400 border border-fuchsia-500/30"
                                >
                                    Write a Review
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Playlist Sidebar */}
                <div className="w-full lg:w-96 bg-slate-900 border-l border-white/5 flex flex-col">
                    <div className="p-4 border-b border-white/5 font-bold text-lg">Course Content</div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {course.modules.map((module, mIdx) => (
                            <div key={mIdx} className="bg-slate-800/40 rounded-xl overflow-hidden border border-white/5">
                                <div className="p-4 bg-white/5 font-semibold text-sm flex justify-between items-center">
                                    {module.title}
                                    <span className="text-xs text-slate-500">{module.videos.length} videos</span>
                                </div>
                                <div>
                                    {module.videos.map((video, vIdx) => (
                                        <button
                                            key={vIdx}
                                            onClick={() => isEnrolled && setActiveVideo(video)}
                                            disabled={!isEnrolled}
                                            className={`w-full text-left p-3 flex items-start gap-3 transition-colors ${activeVideo === video ? "bg-fuchsia-900/20 text-fuchsia-400 border-l-2 border-fuchsia-500" : "hover:bg-white/5 text-slate-400"
                                                } ${!isEnrolled ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <div className="mt-1">
                                                {isEnrolled && activeVideo === video ? (
                                                    <Play className="w-3 h-3 fill-current" />
                                                ) : isEnrolled ? (
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Rate this Course</h3>

                        <div className="flex gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setReviewData({ ...reviewData, rating: star })}>
                                    <Star className={`w-8 h-8 ${star <= reviewData.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
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
                            <button onClick={handleReviewSubmit} className="flex-1 py-3 bg-fuchsia-600 rounded-xl hover:bg-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-fuchsia-900/20">Submit Review</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetailsPage;
