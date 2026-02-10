import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Layers, X, Check, BookOpen } from 'lucide-react';
import API_URL from '../config';

const TechCategories = () => {
    const admin = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const headers = { Authorization: `Bearer ${admin.token}`, 'Content-Type': 'application/json' };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/categories`, { headers });
            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories || []);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        try {
            const url = editId ? `${API_URL}/admin/categories/${editId}` : `${API_URL}/admin/categories`;
            const method = editId ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
            if (res.ok) {
                setShowModal(false);
                setEditId(null);
                setForm({ name: '', description: '' });
                fetchCategories();
            }
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_URL}/admin/categories/${id}`, { method: 'DELETE', headers });
            if (res.ok) {
                setDeleteConfirm(null);
                fetchCategories();
            }
        } catch (e) { console.error(e); }
    };

    const openEdit = (cat) => {
        setEditId(cat._id);
        setForm({ name: cat.name, description: cat.description || '' });
        setShowModal(true);
    };

    const openCreate = () => {
        setEditId(null);
        setForm({ name: '', description: '' });
        setShowModal(true);
    };

    const colors = [
        'from-fuchsia-500 to-purple-600',
        'from-cyan-500 to-blue-600',
        'from-emerald-500 to-green-600',
        'from-amber-500 to-orange-600',
        'from-pink-500 to-rose-600',
        'from-violet-500 to-indigo-600',
        'from-teal-500 to-cyan-600',
        'from-red-500 to-pink-600',
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Tech Categories</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage course categories and tech stacks</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl text-sm font-medium hover:from-fuchsia-500 hover:to-purple-500 shadow-lg shadow-fuchsia-900/20 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-6 h-6 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-[#1a1b25] border border-white/5 rounded-2xl py-16 text-center">
                    <Layers className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="text-slate-500 text-sm">No categories yet. Create one to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((cat, idx) => (
                        <div key={cat._id} className="bg-[#1a1b25] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group relative">
                            {/* Color bar */}
                            <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${colors[idx % colors.length]} mb-4`} />

                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-base">{cat.name}</h3>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setDeleteConfirm(cat._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 line-clamp-2 mb-4">{cat.description || 'No description'}</p>

                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{cat.courseCount || 0} courses</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-[#1a1b25] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4">{editId ? 'Edit Category' : 'New Category'}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Category Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Machine Learning"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fuchsia-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Brief description..."
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fuchsia-500/50 transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-white/5 rounded-xl hover:bg-white/10 text-sm font-medium transition-all">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={!form.name.trim()} className="flex-1 py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl text-sm font-medium hover:from-fuchsia-500 hover:to-purple-500 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5">
                                <Check className="w-4 h-4" /> {editId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-[#1a1b25] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center" onClick={e => e.stopPropagation()}>
                        <Trash2 className="w-10 h-10 mx-auto mb-3 text-red-400" />
                        <h3 className="text-lg font-bold mb-1">Delete Category?</h3>
                        <p className="text-sm text-slate-400 mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/5 rounded-xl hover:bg-white/10 text-sm font-medium transition-all">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 rounded-xl hover:bg-red-500 text-sm font-medium transition-all">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechCategories;
