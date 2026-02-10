import React, { useState, useEffect } from 'react';
import { Users, DollarSign, BookOpen, Activity, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import API_URL from '../config';

const Dashboard = () => {
    const admin = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const headers = { Authorization: `Bearer ${admin.token}` };

    useEffect(() => {
        fetchStats();
        fetchAlerts();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/stats`, { headers });
            if (res.ok) setStats(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchAlerts = async () => {
        try {
            const res = await fetch(`${API_URL}/notifications/${admin._id}`, { headers });
            if (res.ok) {
                const data = await res.json();
                setAlerts((data.notifications || []).slice(0, 8));
            }
        } catch (e) { console.error(e); }
    };

    const kpis = [
        { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-green-600', change: '+12%' },
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-cyan-600', change: `${stats?.totalStudents || 0} students` },
        { label: 'Active Courses', value: stats?.activeCourses || 0, icon: BookOpen, color: 'from-violet-500 to-purple-600', change: `${stats?.pendingCourses || 0} pending` },
        { label: 'Server Health', value: '99.9%', icon: Activity, color: 'from-fuchsia-500 to-pink-600', change: 'Operational' },
    ];

    const getAlertIcon = (type) => {
        switch (type) {
            case 'course_approved': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'course_rejected': return <XCircle className="w-4 h-4 text-red-400" />;
            default: return <AlertTriangle className="w-4 h-4 text-amber-400" />;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold">Welcome Back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-400">Admin</span></h1>
                <p className="text-slate-400 mt-1 text-sm">Here's what's happening with your platform today.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-[#1a1b25] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-slate-400 font-medium">{kpi.label}</span>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <kpi.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{kpi.value}</div>
                        <p className="text-xs text-slate-500">{kpi.change}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Signups Chart */}
                <div className="bg-[#1a1b25] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-fuchsia-400" /> New Signups
                        </h3>
                        <span className="text-xs text-slate-500">Last 6 months</span>
                    </div>
                    {stats?.signupsChart?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={stats.signupsChart}>
                                <defs>
                                    <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                                <YAxis stroke="#475569" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1b25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                <Area type="monotone" dataKey="signups" stroke="#d946ef" strokeWidth={2.5} fill="url(#signupGrad)" dot={{ r: 4, fill: '#d946ef' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No signup data yet</div>
                    )}
                </div>

                {/* Revenue Chart */}
                <div className="bg-[#1a1b25] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-400" /> Revenue
                        </h3>
                        <span className="text-xs text-slate-500">Last 6 months</span>
                    </div>
                    {stats?.revenueChart?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={stats.revenueChart}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="month" stroke="#475569" fontSize={12} />
                                <YAxis stroke="#475569" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1b25', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} formatter={(v) => [`₹${v}`, 'Revenue']} />
                                <Bar dataKey="revenue" fill="url(#revenueGrad)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">No revenue data yet</div>
                    )}
                </div>
            </div>

            {/* System Alerts */}
            <div className="bg-[#1a1b25] border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" /> System Alerts
                </h3>
                {alerts.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-sm">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                        All systems normal. No alerts.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {alerts.map((alert, idx) => (
                            <div key={alert._id || idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
                                {getAlertIcon(alert.type)}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium">{alert.title}</div>
                                    <div className="text-xs text-slate-400 mt-0.5 truncate">{alert.message}</div>
                                </div>
                                <span className="text-[10px] text-slate-500 flex-shrink-0">{new Date(alert.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
