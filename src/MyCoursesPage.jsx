import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Plus, Edit, Users, Star, BookOpen } from "lucide-react";
import API_URL from "./config";

const MyCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const isMentor = user.role === "tutor";

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            let url = `${API_URL}/courses`;
            if (isMentor) {
                url += `?mentor=${user._id}`;
            } else {
                url += `?enrolled=${user._id}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            }
        } catch (error) {
            console.error("Error fetching courses", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-8">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                        <ChevronLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-400">
                            {isMentor ? "My Courses" : "Enrolled Courses"}
                        </h1>
                        <p className="text-slate-400">
                            {isMentor ? "Manage your published courses" : "Your learning journey"}
                        </p>
                    </div>
                </div>
                {isMentor && (
                    <Link to="/create-course">
                        <button className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-xl font-bold transition-colors">
                            <Plus className="w-5 h-5" /> Create Course
                        </button>
                    </Link>
                )}
            </header>

            {loading ? (
                <div className="text-center text-slate-500 py-20">Loading courses...</div>
            ) : courses.length === 0 ? (
                <div className="text-center text-slate-500 py-20">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>{isMentor ? "You haven't created any courses yet" : "You haven't enrolled in any courses yet"}</p>
                    {isMentor && (
                        <Link to="/create-course" className="inline-block mt-4 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-xl font-bold transition-colors">
                            Create Your First Course
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course._id} className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden group hover:border-fuchsia-500/30 transition-all">
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg mb-2 group-hover:text-fuchsia-400 transition-colors">{course.title}</h3>
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{course.enrolledStudents?.length || 0} Students</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{course.modules?.length || 0} Modules</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-400">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span>{course.ratings?.length > 0 ? (course.ratings.reduce((a, b) => a + b.rating, 0) / course.ratings.length).toFixed(1) : "New"}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/courses/${course._id}`} className="flex-1">
                                        <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
                                            View
                                        </button>
                                    </Link>
                                    {isMentor && (
                                        <Link to={`/edit-course/${course._id}`}>
                                            <button className="px-4 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-xl transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCoursesPage;
