import React, { useState, useEffect } from 'react';
import { DollarSign, Search, ChevronLeft, ChevronRight, TrendingUp, ArrowDownRight, ArrowUpRight, Filter } from 'lucide-react';
import API_URL from '../config';

const Payments = () => {
    const admin = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ total: 0, completed: 0, failed: 0, pending: 0 });
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const headers = { Authorization: `Bearer ${admin.token}` };

    useEffect(() => {
        fetchTransactions();
    }, [page, search]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/transactions?page=${page}&limit=12&search=${search}`, { headers });
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions || []);
                setTotalPages(data.totalPages || 1);
                setSummary(data.summary || summary);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const statusColors = {
        completed: 'bg-emerald-500/20 text-emerald-400',
        failed: 'bg-red-500/20 text-red-400',
        pending: 'bg-amber-500/20 text-amber-400',
        created: 'bg-blue-500/20 text-blue-400'
    };

    const filtered = statusFilter === 'all' ? transactions : transactions.filter(t => t.status === statusFilter);

    const summaryCards = [
        { label: 'Total Revenue', value: `₹${summary.total?.toLocaleString() || 0}`, icon: DollarSign, color: 'from-emerald-500 to-green-600', sub: 'All time' },
        { label: 'Completed', value: summary.completed || 0, icon: ArrowUpRight, color: 'from-green-500 to-emerald-600', sub: 'Successful' },
        { label: 'Failed', value: summary.failed || 0, icon: ArrowDownRight, color: 'from-red-500 to-rose-600', sub: 'Failed payments' },
        { label: 'Pending', value: summary.pending || 0, icon: TrendingUp, color: 'from-amber-500 to-orange-600', sub: 'Awaiting' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Payments</h1>
                <p className="text-sm text-slate-400 mt-1">Track all platform transactions</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {summaryCards.map((card, i) => (
                    <div key={i} className="bg-[#1a1b25] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-slate-400 font-medium">{card.label}</span>
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                                <card.icon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{card.sub}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by student name or course..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-[#1a1b25] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-fuchsia-500/50 transition-all"
                    />
                </div>
                <div className="flex gap-1 bg-[#1a1b25] border border-white/10 rounded-xl p-1">
                    {['all', 'completed', 'pending', 'failed'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s
                                ? 'bg-fuchsia-600 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-[#1a1b25] border border-white/5 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-6 h-6 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Student</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Course</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(tx => (
                                <tr key={tx._id} className="hover:bg-white/[0.03] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold">
                                                {tx.student?.fullName?.charAt(0) || 'S'}
                                            </div>
                                            <span className="text-sm font-medium">{tx.student?.fullName || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400 max-w-[200px] truncate">
                                        {tx.course?.title || tx.customOffer ? 'Custom Offer' : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-emerald-400">₹{tx.amount || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${tx.type === 'full' ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                            {tx.type === 'full' ? 'Full Course' : 'Custom'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[tx.status] || statusColors.pending}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {filtered.length === 0 && !loading && (
                    <div className="py-12 text-center text-slate-500 text-sm">No transactions found</div>
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
        </div>
    );
};

export default Payments;
