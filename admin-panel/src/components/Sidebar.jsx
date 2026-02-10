import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, BookOpen, CreditCard,
    Layers, Settings, LogOut, Shield
} from 'lucide-react';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'User Management' },
    { path: '/courses', icon: BookOpen, label: 'Course Approval' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/categories', icon: Layers, label: 'Tech Categories' },
    { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/login');
    };

    return (
        <aside className="w-64 h-screen bg-[#13141b] border-r border-white/5 flex flex-col fixed left-0 top-0 z-30">
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-700 flex items-center justify-center shadow-lg shadow-fuchsia-900/30">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-400">EdTech</h1>
                        <span className="text-[10px] text-fuchsia-400/70 font-medium tracking-wider uppercase">Admin Panel</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-gradient-to-r from-fuchsia-600/20 to-purple-600/10 text-fuchsia-400 border border-fuchsia-500/20 shadow-lg shadow-fuchsia-900/10'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
