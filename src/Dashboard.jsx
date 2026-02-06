import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    LayoutDashboard, BookOpen, FileText, Video, Settings, LogOut,
    Bell, Search, Plus, Users, MessageCircle
} from "lucide-react";

const Dashboard = () => {
    // 1. Get User Info from LocalStorage
    const [user, setUser] = useState({
        name: "User",
        role: "student", // Default role
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        ...JSON.parse(localStorage.getItem("userInfo") || "{}")
    });

    // Ensure state stays in sync if localStorage changes (optional, but good for reliable demos)
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (storedUser) {
            setUser(prev => ({ ...prev, ...storedUser }));
        }
    }, []);

    const role = user.role;
    const isStudent = role === "student";

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications] = useState([
        { id: 1, text: "New course available: Advanced MERN", time: "2h ago", read: false },
        { id: 2, text: "Mentor Arjun accepted your request", time: "5h ago", read: true },
        { id: 3, text: "Welcome to EduConnect!", time: "1d ago", read: true },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", active: true, link: "/dashboard" },
        { icon: BookOpen, label: "My Courses", link: "/dashboard" },

        // Student Specific
        ...(isStudent ? [
            { icon: FileText, label: "Resume Builder", link: "/resume" },
            { icon: Video, label: "Browse Courses", link: "/courses" }
        ] : []),

        // Tutor Specific
        ...(!isStudent ? [
            { icon: FileText, label: "Student Requests", link: "#" },
            { icon: Video, label: "Content Studio", link: "#" }
        ] : []),

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
                    <div className="mt-2 text-xs px-2 py-1 rounded border border-white/10 inline-block text-slate-400 capitalize">
                        {role} Dashboard
                    </div>
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
                            window.location.href = "/login";
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
                            Welcome Back, <span className="text-white capitalize">{user.name}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search (Hidden on mobile) */}
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-slate-800/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-fuchsia-500/50 w-64 transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
                                )}
                            </button>

                            {/* Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                    <div className="p-3 border-b border-white/10 font-semibold text-sm">Notifications</div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.map(notif => (
                                            <div key={notif.id} className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-white/5' : ''}`}>
                                                <p className="text-sm text-slate-200">{notif.text}</p>
                                                <span className="text-xs text-slate-500 block mt-1">{notif.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-2 text-center border-t border-white/10">
                                        <button className="text-xs text-fuchsia-400 hover:text-fuchsia-300">Mark all as read</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Link */}
                        <Link to="/profile" className="flex items-center gap-3 group">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-white group-hover:text-fuchsia-400 transition-colors capitalize">{user.name}</div>
                                <div className="text-xs text-slate-500 capitalize">{role}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden group-hover:border-fuchsia-500 transition-colors relative">
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Dashboard Stats & Content Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Stats Grid - Differentiate based on role if needed */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: isStudent ? "Courses Enrolled" : "Total Students", value: isStudent ? "2" : "15", sub: isStudent ? "In Progress" : "Active" },
                            { label: isStudent ? "Certificates" : "Active Courses", value: "0", sub: isStudent ? "Earned" : "Published" },
                            { label: isStudent ? "Resume Credits" : "Total Earnings", value: "3", sub: isStudent ? "Free uses" : "This Month" },
                            { label: isStudent ? "Interviews" : "Pending Requests", value: "1", sub: isStudent ? "Attended" : "To Review" },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-slate-800/40 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors">
                                <h3 className="text-slate-400 text-sm font-medium mb-2">{stat.label}</h3>
                                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-slate-500">{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Action Center / Active Course */}
                    <div className="bg-slate-800/40 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start group">
                        {isStudent ? (
                            <>
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
                            </>
                        ) : (
                            // Mentor View
                            <div className="flex-1 w-full">
                                <div className="text-xs font-bold text-fuchsia-400 tracking-wider mb-2 uppercase">Action Center</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Ready To Teach ?</h3>
                                <p className="text-slate-400 mb-6">Upload Your Next Module</p>
                                <button className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-fuchsia-900/20">
                                    + Create New Class
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
