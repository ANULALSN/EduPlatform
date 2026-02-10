import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

const Layout = () => {
    const admin = JSON.parse(localStorage.getItem('adminInfo') || '{}');

    return (
        <div className="flex min-h-screen bg-[#0f1117]">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                {/* Topbar */}
                <header className="h-16 bg-[#13141b]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-fuchsia-500/50 w-72 transition-all placeholder:text-slate-500"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
                                {admin.fullName?.charAt(0) || 'A'}
                            </div>
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium">{admin.fullName || 'Admin'}</div>
                                <div className="text-[11px] text-fuchsia-400">Administrator</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
