import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import API_URL from '../config';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, deviceType: 'laptop' })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Login failed');
                setLoading(false);
                return;
            }

            if (data.role !== 'admin') {
                setError('Access denied. Admin credentials required.');
                setLoading(false);
                return;
            }

            localStorage.setItem('adminInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background effect */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-700 flex items-center justify-center mx-auto shadow-2xl shadow-fuchsia-900/30 mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Admin Control Center</h1>
                    <p className="text-sm text-slate-400 mt-1">Sign in to manage EduConnect</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="bg-[#1a1b25] border border-white/5 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all placeholder:text-slate-500"
                                placeholder="admin@educonnect.com"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all placeholder:text-slate-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-lg shadow-fuchsia-900/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Shield className="w-4 h-4" /> Sign In to Admin
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-500 mt-6">Restricted access. Admin credentials only.</p>
            </div>
        </div>
    );
};

export default AdminLogin;
