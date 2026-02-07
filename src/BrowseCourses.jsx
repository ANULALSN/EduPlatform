import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, PlayCircle, Clock, Star, Users, ChevronLeft, BookOpen, ArrowRight } from "lucide-react";
import API_URL from "./config";

const BrowseCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetchCourses();
    }, [selectedCategory, searchTerm]);

    const fetchCourses = async () => {
        try {
            let url = `${API_URL}/courses?`;
            if (selectedCategory !== "All") url += `category=${selectedCategory}&`;
            if (searchTerm) url += `search=${searchTerm}`;

            const response = await fetch(url);
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

    const categories = ["All", "Web Development", "Data Science", "Mobile Development", "UI/UX Design", "DevOps", "Cybersecurity"];

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-8 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link to="/dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                            <ChevronLeft className="w-5 h-5 text-slate-400" />
                        </Link>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-400">
                            Explore Courses
                        </h1>
                    </div>
                    <p className="text-slate-400 pl-12">Discover new skills and advance your career</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-800 border border-white/10 rounded-xl py-3 pl-12 pr-6 w-full sm:w-72 focus:outline-none focus:border-fuchsia-500/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </header>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-8 custom-scrollbar">
                {categories.map((cat, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${selectedCategory === cat
                                ? "bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-900/40"
                                : "bg-slate-800/50 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="text-center text-slate-500 py-20">Loading courses...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div key={course._id} className="group bg-slate-800/40 border border-white/5 rounded-3xl overflow-hidden hover:border-fuchsia-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-900/10 flex flex-col h-full">
                            {/* Course Thumbnail */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                    alt={course.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10">
                                        {course.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-white/10">
                                            <img src={course.mentor?.avatar || `https://ui-avatars.com/api/?name=${course.mentor?.fullName}`} alt="Mentor" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-sm text-slate-300 font-medium">{course.mentor?.fullName}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span>{course.ratings && course.ratings.length > 0 ? (course.ratings.reduce((a, b) => a + b.rating, 0) / course.ratings.length).toFixed(1) : "New"}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-fuchsia-400 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1">
                                    {course.description}
                                </p>

                                <div className="flex justify-between items-center sm:hidden md:flex lg:hidden xl:flex mb-6 text-xs text-slate-500 font-medium">
                                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> <span>{course.modules?.length * 2 || 12}h 30m</span></div>
                                    <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> <span>{course.modules?.length} Modules</span></div>
                                    <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> <span>{course.enrolledStudents?.length || 0} Students</span></div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="text-2xl font-bold text-white">
                                        ₹{course.price}
                                    </div>
                                    <Link to={`/courses/${course._id}`}>
                                        <button className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-fuchsia-500 hover:text-white transition-all shadow-lg shadow-white/5 hover:shadow-fuchsia-500/30 flex items-center gap-2">
                                            View Course <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseCourses;
