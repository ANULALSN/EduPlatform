import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, PlayCircle, Clock, Star, Users, ChevronLeft, BookOpen, ArrowRight } from "lucide-react";
import API_URL from "./config";

const DUMMY_COURSES = [
    {
        _id: "dummy1",
        title: "Complete MERN Stack Development",
        description: "Learn MongoDB, Express, React, and Node.js from scratch. Build real-world projects and become a full-stack developer.",
        category: "Web Development",
        price: 4999,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
        mentor: { fullName: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random" },
        modules: [{}, {}, {}, {}],
        enrolledStudents: [{}, {}, {}, {}, {}],
        ratings: [{ rating: 4.5 }, { rating: 5 }, { rating: 4 }]
    },
    {
        _id: "dummy2",
        title: "Advanced React & Next.js Masterclass",
        description: "Master modern React patterns, Server Components, App Router, and build production-ready applications.",
        category: "Web Development",
        price: 3999,
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80",
        mentor: { fullName: "Sarah Smith", avatar: "https://ui-avatars.com/api/?name=Sarah+Smith&background=random" },
        modules: [{}, {}, {}],
        enrolledStudents: [{}, {}, {}],
        ratings: [{ rating: 5 }, { rating: 4.8 }]
    },
    {
        _id: "dummy3",
        title: "Data Science with Python & Machine Learning",
        description: "Comprehensive course covering Python, Pandas, NumPy, Scikit-learn, TensorFlow, and real ML projects.",
        category: "Data Science",
        price: 5999,
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        mentor: { fullName: "Mike Johnson", avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=random" },
        modules: [{}, {}, {}, {}, {}],
        enrolledStudents: [{}, {}, {}, {}, {}, {}, {}],
        ratings: [{ rating: 4.7 }, { rating: 4.5 }, { rating: 5 }]
    },
    {
        _id: "dummy4",
        title: "Flutter Mobile App Development",
        description: "Build beautiful, natively compiled applications for mobile from a single codebase using Flutter and Dart.",
        category: "Mobile Development",
        price: 4499,
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
        mentor: { fullName: "Emily Chen", avatar: "https://ui-avatars.com/api/?name=Emily+Chen&background=random" },
        modules: [{}, {}, {}, {}],
        enrolledStudents: [{}, {}, {}],
        ratings: [{ rating: 4.9 }]
    },
    {
        _id: "dummy5",
        title: "UI/UX Design Fundamentals",
        description: "Learn design principles, Figma, user research, wireframing, and create stunning user interfaces.",
        category: "UI/UX Design",
        price: 2999,
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
        mentor: { fullName: "Alex Rivera", avatar: "https://ui-avatars.com/api/?name=Alex+Rivera&background=random" },
        modules: [{}, {}],
        enrolledStudents: [{}, {}, {}, {}],
        ratings: [{ rating: 4.6 }, { rating: 4.8 }]
    },
    {
        _id: "dummy6",
        title: "DevOps & Cloud Engineering",
        description: "Master Docker, Kubernetes, AWS, CI/CD pipelines, and infrastructure as code with Terraform.",
        category: "DevOps",
        price: 6499,
        thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80",
        mentor: { fullName: "David Park", avatar: "https://ui-avatars.com/api/?name=David+Park&background=random" },
        modules: [{}, {}, {}, {}, {}, {}],
        enrolledStudents: [{}, {}],
        ratings: [{ rating: 5 }, { rating: 4.9 }]
    }
];

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
                // If no real courses, show dummy courses
                if (data.length === 0) {
                    let filtered = DUMMY_COURSES;
                    if (selectedCategory !== "All") {
                        filtered = filtered.filter(c => c.category === selectedCategory);
                    }
                    if (searchTerm) {
                        filtered = filtered.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
                    }
                    setCourses(filtered);
                } else {
                    setCourses(data);
                }
            } else {
                setCourses(DUMMY_COURSES);
            }
        } catch (error) {
            console.error("Error fetching courses", error);
            setCourses(DUMMY_COURSES);
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
                <div className="text-center text-slate-500 py-20">
                    <div className="animate-spin w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    Loading courses...
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center text-slate-500 py-20">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No courses found for "{searchTerm || selectedCategory}"</p>
                </div>
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
                                {course._id.startsWith("dummy") && (
                                    <div className="absolute top-4 right-4">
                                        <span className="px-2 py-1 bg-amber-500/80 rounded text-xs font-bold text-black">
                                            SAMPLE
                                        </span>
                                    </div>
                                )}
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
                                        <span>{course.ratings && course.ratings.length > 0 ? (course.ratings.reduce((a, b) => a + (b.rating || 0), 0) / course.ratings.length).toFixed(1) : "New"}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-fuchsia-400 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1">
                                    {course.description}
                                </p>

                                <div className="flex justify-between items-center sm:hidden md:flex lg:hidden xl:flex mb-6 text-xs text-slate-500 font-medium">
                                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> <span>{(course.modules?.length || 1) * 2}h 30m</span></div>
                                    <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> <span>{course.modules?.length || 0} Modules</span></div>
                                    <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> <span>{course.enrolledStudents?.length || 0} Students</span></div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="text-2xl font-bold text-white">
                                        ₹{course.price}
                                    </div>
                                    <Link to={course._id.startsWith("dummy") ? "#" : `/courses/${course._id}`}>
                                        <button
                                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 ${course._id.startsWith("dummy")
                                                    ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                                                    : "bg-white text-slate-900 hover:bg-fuchsia-500 hover:text-white shadow-white/5 hover:shadow-fuchsia-500/30"
                                                }`}
                                            disabled={course._id.startsWith("dummy")}
                                        >
                                            {course._id.startsWith("dummy") ? "Coming Soon" : "View Course"} <ArrowRight className="w-4 h-4" />
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
