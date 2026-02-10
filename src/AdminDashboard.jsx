import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    LayoutDashboard, Users, BookOpen, DollarSign, Shield, ShieldOff,
    CheckCircle, XCircle, Search, Home, LogOut, TrendingUp, UserCheck, Clock
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import API_URL from "./config";

const AdminDashboard = () => {
    const [user] = useState(() => JSON.parse(localStorage.getItem("userInfo") || "{}"));
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [userSearch, setUserSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const headers = { Authorization: `Bearer ${user.token}` };

    useEffect(() => {
        if (user.role !== "admin") {
            window.location.href = "/dashboard";
            return;
        }
        fetchStats();
        fetchUsers();
        fetchPendingCourses();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/stats`, { headers });
            if (res.ok) setStats(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchUsers = async (search = "") => {
        try {
            const res = await fetch(`${API_URL}/admin/users?search=${search}`, { headers });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (e) { console.error(e); }
    };

    const fetchPendingCourses = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/courses/pending`, { headers });
            if (res.ok) setPendingCourses(await res.json());
        } catch (e) { console.error(e); }
    };

    const toggleBan = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
                method: "PUT", headers
            });
            if (res.ok) fetchUsers(userSearch);
        } catch (e) { console.error(e); }
    };

    const handleCourseAction = async (courseId, action) => {
        try {
            const res = await fetch(`${API_URL}/admin/courses/${courseId}/${action}`, {
                method: "PUT",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({ reason: action === "reject" ? "Does not meet quality standards." : undefined })
            });
            if (res.ok) fetchPendingCourses();
        } catch (e) { console.error(e); }
    };

    const kpiCards = [
        { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "from-blue-500 to-cyan-500", sub: `${stats?.totalStudents || 0} Students · ${stats?.totalTutors || 0} Tutors` },
        { label: "Total Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "from-emerald-500 to-green-500", sub: "All time" },
        { label: "Active Courses", value: stats?.activeCourses || 0, icon: BookOpen, color: "from-violet-500 to-purple-500", sub: "Approved & Live" },
        { label: "Pending Approval", value: stats?.pendingCourses || 0, icon: Clock, color: "from-amber-500 to-orange-500", sub: "Awaiting review" },
    ];

    const tabs = [
        { id: "overview", label: "Overview", icon: TrendingUp },
        { id: "users", label: "Users", icon: Users },
        { id: "approvals", label: "Approvals", icon: CheckCircle, badge: pendingCourses.length },
    ];

    if (user.role !== "admin") return null;

    return (
        <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-white/5">
                    <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-pink-500">
                        EdTech
                    </Link>
                    <div className="mt-2 text-xs px-2 py-1 rounded border border-red-500/30 inline-block text-red-400 bg-red-500/10">
                        Admin Panel
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <Home className="w-5 h-5 text-slate-500" />
                        <span className="font-medium">Home</span>
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-white border border-white/5 shadow-lg shadow-black/20">
                        <LayoutDashboard className="w-5 h-5 text-red-400" />
                        <span className="font-medium">Admin Dashboard</span>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => { localStorage.removeItem("userInfo"); window.location.href = "/login"; }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-20 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-8">
                    <h2 className="text-xl font-semibold">
                        <span className="text-slate-400">Admin</span> <span className="text-white">Control Center</span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium">{user.fullName}</div>
                            <div className="text-xs text-red-400">Admin</div>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-1 px-8 pt-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-medium transition-all ${activeTab === tab.id
                                ? "bg-slate-800 text-white border border-white/10 border-b-0"
                                : "text-slate-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.badge > 0 && (
                                <span className="px-2 py-0.5 bg-amber-500 text-[10px] font-bold rounded-full text-black">{tab.badge}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 pb-8 bg-slate-800/20">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* === OVERVIEW TAB === */}
                            {activeTab === "overview" && (
                                <div className="space-y-8 pt-6">
                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                                        {kpiCards.map((card, idx) => (
                                            <div key={idx} className="bg-slate-800/60 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors group">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-sm text-slate-400 font-medium">{card.label}</h4>
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                                                        <card.icon className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                                <div className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">
                                                    {card.value}
                                                </div>
                                                <p className="text-xs text-slate-500">{card.sub}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Charts */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Signups Chart */}
                                        <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-6">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <UserCheck className="w-5 h-5 text-cyan-400" /> New Signups per Month
                                            </h3>
                                            {stats?.signupsChart?.length > 0 ? (
                                                <ResponsiveContainer width="100%" height={280}>
                                                    <LineChart data={stats.signupsChart}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                                        <YAxis stroke="#64748b" fontSize={12} />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                                        />
                                                        <Line type="monotone" dataKey="signups" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5, fill: '#06b6d4' }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="h-64 flex items-center justify-center text-slate-500">No signup data yet</div>
                                            )}
                                        </div>

                                        {/* Revenue Chart */}
                                        <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-6">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <DollarSign className="w-5 h-5 text-emerald-400" /> Revenue per Month
                                            </h3>
                                            {stats?.revenueChart?.length > 0 ? (
                                                <ResponsiveContainer width="100%" height={280}>
                                                    <BarChart data={stats.revenueChart}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                                                        <YAxis stroke="#64748b" fontSize={12} />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                                            formatter={(value) => [`₹${value}`, 'Revenue']}
                                                        />
                                                        <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="h-64 flex items-center justify-center text-slate-500">No revenue data yet</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* === USERS TAB === */}
                            {activeTab === "users" && (
                                <div className="pt-6 space-y-6">
                                    {/* Search */}
                                    <div className="relative max-w-md">
                                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Search users by name or email..."
                                            value={userSearch}
                                            onChange={(e) => { setUserSearch(e.target.value); fetchUsers(e.target.value); }}
                                            className="w-full bg-slate-800/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-fuchsia-500/50 transition-all"
                                        />
                                    </div>

                                    {/* Users Table */}
                                    <div className="bg-slate-800/60 border border-white/5 rounded-2xl overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {users.map(u => (
                                                    <tr key={u._id} className={`hover:bg-white/5 transition-colors ${u.isBanned ? 'opacity-60' : ''}`}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={u.avatar || `https://ui-avatars.com/api/?name=${u.fullName}&background=random`}
                                                                    alt={u.fullName}
                                                                    className="w-9 h-9 rounded-full object-cover border border-white/10"
                                                                />
                                                                <span className="font-medium text-sm">{u.fullName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-400">{u.email}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.role === 'tutor'
                                                                ? 'bg-violet-500/20 text-violet-300'
                                                                : 'bg-cyan-500/20 text-cyan-300'
                                                                }`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.isBanned
                                                                ? 'bg-red-500/20 text-red-400'
                                                                : 'bg-emerald-500/20 text-emerald-400'
                                                                }`}>
                                                                {u.isBanned ? 'Banned' : 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => toggleBan(u._id)}
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${u.isBanned
                                                                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                                    }`}
                                                            >
                                                                {u.isBanned ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                                                {u.isBanned ? 'Unban' : 'Ban'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {users.length === 0 && (
                                            <div className="py-12 text-center text-slate-500">No users found</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* === APPROVALS TAB === */}
                            {activeTab === "approvals" && (
                                <div className="pt-6 space-y-5">
                                    <h3 className="text-lg font-semibold text-slate-200">Course Approval Queue</h3>

                                    {pendingCourses.length === 0 ? (
                                        <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-12 text-center">
                                            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                            <p className="text-slate-400 font-medium">All caught up! No courses pending review.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {pendingCourses.map(course => (
                                                <div key={course._id} className="bg-slate-800/60 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-5 items-start md:items-center hover:border-amber-500/20 transition-colors">
                                                    {/* Thumbnail */}
                                                    <div className="w-full md:w-40 h-24 rounded-xl overflow-hidden bg-slate-700/50 flex-shrink-0">
                                                        {course.thumbnail ? (
                                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                                <BookOpen className="w-8 h-8" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-base font-semibold text-white truncate">{course.title}</h4>
                                                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">{course.description}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                            <span>By: <strong className="text-slate-300">{course.mentor?.fullName}</strong></span>
                                                            <span>₹{course.price}</span>
                                                            <span>{course.modules?.length || 0} modules</span>
                                                            <span className="text-amber-400">{course.category}</span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleCourseAction(course._id, "approve")}
                                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-medium transition-colors"
                                                        >
                                                            <CheckCircle className="w-4 h-4" /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleCourseAction(course._id, "reject")}
                                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors"
                                                        >
                                                            <XCircle className="w-4 h-4" /> Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
