import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    LayoutDashboard, BookOpen, FileText, Video, Settings, LogOut,
    Bell, Search, Plus, Users, MessageCircle
} from "lucide-react";

const Dashboard = () => {
    const [role, setRole] = useState("student"); // Toggle for demo - In real app, get from Context/LocalStorage

    // Load user info to get real role if needed, currently using state toggle for demo as per previous file
    // const user = JSON.parse(localStorage.getItem("userInfo"));
    // if (user && user.role !== role) setRole(user.role);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", active: true, link: "/dashboard" },
        { icon: BookOpen, label: "My Courses", link: "/dashboard" }, // Placeholder link
        {
            icon: FileText,
            label: role === "student" ? "Resume Builder" : "Student Requests",
            link: role === "student" ? "/resume" : "#"
        },
        // Only show Browse Courses to Students
        ...(role === "student" ? [{ icon: Video, label: "Browse Courses", link: "/courses" }] : []),
        // Show Content Studio only to Tutors
        ...(role === "tutor" ? [{ icon: Video, label: "Content Studio", link: "#" }] : []),

        { icon: Users, label: "Mentors", link: "/mentors" },
        { icon: MessageCircle, label: "Messages", link: "/chat" },

        { icon: Settings, label: "Settings", link: "/profile" },
    ];

    return (
        <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-white/5">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-pink-500">
                        EdTech
                    </span>
                    {/* Role Toggle for Demo Purposes - allow user to switch to see both views */}
                    <button
                        onClick={() => setRole(role === "student" ? "tutor" : "student")}
                        className="mt-2 text-xs text-slate-500 hover:text-white border border-white/10 px-2 py-1 rounded"
                    >
                        Switch Role (Demo): {role}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item, idx) => (
                        <Link key={idx} to={item.link} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                            ? "bg-slate-800 text-white border border-white/5 shadow-lg shadow-black/20"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}>
                            <item.icon className={`w-5 h-5 ${item.active ? "text-fuchsia-500" : "text-slate-500"}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => {
                            localStorage.removeItem("userInfo");
                            window.location.href = "/login"; // Force reload/redirect
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Topbar */}
                <header className="h-20 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-slate-200">
                            Welcome Back, <span className="text-white">User</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-slate-800/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-fuchsia-500/50 w-64 transition-all"
                            />
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
                        </button>
                        <Link to="/profile">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden cursor-pointer hover:border-fuchsia-500 transition-colors">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: "Courses Enrolled", value: "2", sub: "In Progress" },
                            { label: "Certificates", value: "0", sub: "Earned" },
                            { label: "Resume Credits", value: "3", sub: "Free uses" },
                            { label: "Interviews", value: "1", sub: "Attended" },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-slate-800/40 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors">
                                <h3 className="text-slate-400 text-sm font-medium mb-2">{stat.label}</h3>
                                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-slate-500">{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Active Course Card */}
                    <div className="bg-slate-800/40 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start group">
                        <div className="w-full md:w-80 aspect-video rounded-2xl overflow-hidden bg-slate-700/50 relative shadow-xl shadow-black/20">
                            <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" alt="Course" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                        </div>
                        <div className="flex-1 w-full">
                            <div className="text-xs font-bold text-fuchsia-400 tracking-wider mb-2 uppercase">Course in Progress</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Full Stack Web Development</h3>
                            <p className="text-slate-400 mb-6">Module 3: Understanding React Hooks</p>

                            <div className="w-full bg-slate-700/50 rounded-full h-2 mb-6 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            </div>

                            <button className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-fuchsia-900/20">
                                Resume Learning
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
