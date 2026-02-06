import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Bell, User, BookOpen, Shield, Code, Brain } from "lucide-react";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
            {/* Navbar */}
            <nav className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center font-bold text-lg">E</div>
                        <span className="text-xl font-bold tracking-tight">EduConnect</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                            <a href="#" className="hover:text-white transition-colors">Courses</a>
                            <a href="#" className="hover:text-white transition-colors">Mentors</a>
                            <a href="#" className="hover:text-white transition-colors">Community</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fuchsia-500 rounded-full border border-slate-900"></span>
                            </button>
                            <Link to="/profile" className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden hover:border-fuchsia-500/50 transition-colors">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-slate-900 to-slate-900" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                        >
                            Switch Your Career <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">To Tech</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-400 mb-8 max-w-xl mx-auto md:mx-0"
                        >
                            Join the best learning platform for students and mentors. Master new skills, build projects, and get hired.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
                        >
                            <Link to="/courses" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 font-semibold shadow-lg shadow-fuchsia-900/30 hover:scale-[1.02] transition-transform">
                                Explore Courses
                            </Link>
                            <button className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition-colors">
                                Become a Mentor
                            </button>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative">
                        {/* Placeholder for Hero Image */}
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Students learning"
                                className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Popular Categories */}
            <section className="py-20 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12 text-slate-200">Popular Categories</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Code, label: "MERN Stack", color: "text-blue-400" },
                            { icon: Shield, label: "Cyber Security", color: "text-green-400" },
                            { icon: BookOpen, label: "Flutter Dev", color: "text-sky-400" },
                            { icon: Brain, label: "AI Tools", color: "text-purple-400" },
                        ].map((cat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-fuchsia-500/30 transition-colors cursor-pointer group flex flex-col items-center gap-4"
                            >
                                <cat.icon className={`w-12 h-12 ${cat.color} group-hover:scale-110 transition-transform`} />
                                <h3 className="font-semibold text-lg text-slate-300 group-hover:text-white">{cat.label}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
