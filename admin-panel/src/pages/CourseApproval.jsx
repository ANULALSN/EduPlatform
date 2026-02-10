import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, BookOpen, User, Image, Filter } from 'lucide-react';
import API_URL from '../config';

const CourseApproval = () => {
    const admin = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    const [courses, setCourses] = useState([]);
    const [tab, setTab] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const headers = { Authorization: `Bearer ${admin.token}`, 'Content-Type': 'application/json' };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/courses`, { headers });
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses || []);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleApprove = async (courseId) => {
        try {
            const res = await fetch(`${API_URL}/admin/courses/${courseId}/approve`, { method: 'PUT', headers });
            if (res.ok) fetchCourses();
        } catch (e) { console.error(e); }
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        try {
            const res = await fetch(`${API_URL}/admin/courses/${rejectModal}/reject`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ reason: rejectReason })
            });
            if (res.ok) {
                setRejectModal(null);
                setRejectReason('');
                fetchCourses();
            }
        } catch (e) { console.error(e); }
    };

    const filtered = courses.filter(c => {
        if (tab === 'pending') return c.status === 'pending';
        if (tab === 'approved') return c.status === 'approved';
        if (tab === 'rejected') return c.status === 'rejected';
        return true;
    });

    const statusConfig = {
        pending: { color: 'bg-amber-500/20 text-amber-400', icon: Clock },
        approved: { color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle },
        rejected: { color: 'bg-red-500/20 text-red-400', icon: XCircle }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Course Approval</h1>
                <p className="text-sm text-slate-400 mt-1">Review and manage course submissions</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-[#1a1b25] border border-white/10 rounded-xl p-1 w-fit">
                {['pending', 'approved', 'rejected'].map(t => {
                    const count = courses.filter(c => c.status === t).length;
                    return (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === t
                                ? 'bg-fuchsia-600 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-white/20' : 'bg-white/5'}`}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-6 h-6 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-[#1a1b25] border border-white/5 rounded-2xl py-16 text-center">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="text-slate-500 text-sm">No {tab} courses</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map(course => {
                        const cfg = statusConfig[course.status];
                        return (
                            <div key={course._id} className="bg-[#1a1b25] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
                                {/* Thumbnail */}
                                <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Image className="w-8 h-8 text-slate-600" />
                                        </div>
                                    )}
                                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${cfg.color}`}>
                                        {course.status}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-base mb-1 line-clamp-1">{course.title}</h3>
                                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{course.description}</p>

                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-[10px] font-bold">
                                            {course.mentor?.fullName?.charAt(0) || 'T'}
                                        </div>
                                        <span className="text-xs text-slate-400">{course.mentor?.fullName || 'Unknown Tutor'}</span>
                                        <span className="ml-auto text-sm font-semibold text-fuchsia-400">₹{course.price || 0}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                        <span>{course.modules?.length || 0} modules</span>
                                        <span>•</span>
                                        <span>{course.enrolledStudents?.length || 0} enrolled</span>
                                    </div>

                                    {course.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(course._id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-all"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Approve
                                            </button>
                                            <button
                                                onClick={() => setRejectModal(course._id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-all"
                                            >
                                                <XCircle className="w-4 h-4" /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reject Reason Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setRejectModal(null)}>
                    <div className="bg-[#1a1b25] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-1">Reject Course</h3>
                        <p className="text-sm text-slate-400 mb-4">Provide a reason for rejecting this course.</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="e.g. Insufficient content quality..."
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 transition-all resize-none"
                        />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setRejectModal(null)} className="flex-1 py-2.5 bg-white/5 rounded-xl hover:bg-white/10 text-sm font-medium transition-all">
                                Cancel
                            </button>
                            <button onClick={handleReject} className="flex-1 py-2.5 bg-red-600 rounded-xl hover:bg-red-500 text-sm font-medium transition-all">
                                Reject Course
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseApproval;
