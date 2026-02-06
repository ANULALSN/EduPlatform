import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, PlayCircle, Clock, Star, Users } from "lucide-react";

const courses = [
    {
        id: 1,
        title: "Full Stack Web Development",
        category: "Development",
        level: "Beginner",
        duration: "12 Weeks",
        students: "1.2k",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["MERN", "React", "Node.js"]
    },
    {
        id: 2,
        title: "Cyber Security Fundamentals",
        category: "Security",
        level: "Intermediate",
        duration: "8 Weeks",
        students: "850",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["Ethical Hacking", "Network Security"]
    },
    {
        id: 3,
        title: "Flutter Mobile App Dev",
        category: "Mobile",
        level: "Advanced",
        duration: "10 Weeks",
        students: "2.5k",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["Dart", "iOS", "Android"]
    },
    {
        id: 4,
        title: "AI Tools & Prompt Engineering",
        category: "AI/ML",
        level: "Beginner",
        duration: "4 Weeks",
        students: "5.0k",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["ChatGPT", "Midjourney", "LLMs"]
    }
];

const categories = ["All", "Development", "Security", "Mobile", "AI/ML", "Design"];

const BrowseCourses = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = courses.filter(course =>
        (activeCategory === "All" || course.category === activeCategory) &&
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden relative">
            {/* Background Mesh */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] left-[20%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-fuchsia-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Explore Courses
                        </h1>
                        <p className="text-slate-400">Discover new skills and advance your career.</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500/50 backdrop-blur-md transition-all shadow-lg"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${activeCategory === cat
                                    ? "bg-fuchsia-600/20 border-fuchsia-500 text-white shadow-[0_0_15px_rgba(192,38,211,0.3)] backdrop-blur-md"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white backdrop-blur-sm"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course, idx) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden hover:border-fuchsia-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-fuchsia-900/20 hover:-translate-y-1"
                        >
                            {/* Image area */}
                            <div className="h-48 relative overflow-hidden">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium border border-white/10 text-white">
                                    {course.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-white leading-tight line-clamp-2">
                                    {course.title}
                                </h3>

                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {course.duration}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5" />
                                        {course.students}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-amber-400">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        {course.rating}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {course.tags.map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/5 text-slate-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-fuchsia-600 hover:text-white border border-white/5 font-semibold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-fuchsia-900/30">
                                    <PlayCircle className="w-4 h-4" />
                                    Enroll Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrowseCourses;
