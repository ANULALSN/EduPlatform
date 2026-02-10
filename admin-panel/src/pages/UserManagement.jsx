import React, { useState, useEffect } from 'react';
import { Search, Shield, ShieldOff, ChevronLeft, ChevronRight, Eye, Mail } from 'lucide-react';
import API_URL from '../config';

const UserManagement = () => {
    const admin = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [roleFilter, setRoleFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const headers = { Authorization: `Bearer ${admin.token}` };

    useEffect(() => {
        fetchUsers();
    }, [search, page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/users?search=${search}&page=${page}&limit=10`, { headers });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const toggleBan = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/ban`, { method: 'PUT', headers });
            if (res.ok) fetchUsers();
        } catch (e) { console.error(e); }
    };

    const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

    const roleBadge = (role) => {
        const colors = {
            student: 'bg-cyan-500/20 text-cyan-400',
            tutor: 'bg-violet-500/20 text-violet-400',
            admin: 'bg-fuchsia-500/20 text-fuchsia-400'
        };
        return colors[role] || 'bg-slate-500/20 text-slate-400';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage all platform users</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">{users.length} users on page</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-[#1a1b25] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-fuchsia-500/50 transition-all"
                    />
                </div>
                <div className="flex gap-1 bg-[#1a1b25] border border-white/10 rounded-xl p-1">
                    {['all', 'student', 'tutor'].map(r => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${roleFilter === r
                                ? 'bg-fuchsia-600 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1) + 's'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1a1b25] border border-white/5 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-6 h-6 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(u => (
                                <tr key={u._id} className={`hover:bg-white/[0.03] transition-colors ${u.isBanned ? 'opacity-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={u.avatar || `https://ui-avatars.com/api/?name=${u.fullName}&background=random&size=40`}
                                                alt={u.fullName}
                                                className="w-9 h-9 rounded-full object-cover border border-white/10"
                                            />
                                            <span className="font-medium text-sm">{u.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleBadge(u.role)}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {u.isBanned ? 'Banned' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center gap-2 justify-end">
                                            <button
                                                onClick={() => setSelectedUser(u)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
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
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {filteredUsers.length === 0 && !loading && (
                    <div className="py-12 text-center text-slate-500 text-sm">No users found</div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                    <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedUser(null)}>
                    <div className="bg-[#1a1b25] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.fullName}&background=random&size=80`}
                                alt={selectedUser.fullName}
                                className="w-16 h-16 rounded-full border-2 border-fuchsia-500/30"
                            />
                            <div>
                                <h3 className="text-xl font-bold">{selectedUser.fullName}</h3>
                                <p className="text-sm text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedUser.email}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${roleBadge(selectedUser.role)}`}>
                                    {selectedUser.role}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-slate-500 text-xs">Status</div>
                                <div className={`font-medium ${selectedUser.isBanned ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {selectedUser.isBanned ? 'Banned' : 'Active'}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-slate-500 text-xs">Joined</div>
                                <div className="font-medium">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '-'}</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-slate-500 text-xs">Mobile</div>
                                <div className="font-medium">{selectedUser.mobile || '-'}</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3">
                                <div className="text-slate-500 text-xs">Gender</div>
                                <div className="font-medium capitalize">{selectedUser.gender || '-'}</div>
                            </div>
                        </div>

                        <button onClick={() => setSelectedUser(null)} className="w-full mt-6 py-2.5 bg-white/5 rounded-xl hover:bg-white/10 text-sm font-medium transition-all">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
