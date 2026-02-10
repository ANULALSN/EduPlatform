import React, { useState, useEffect } from 'react';
import { Save, Shield, Key, User, Bell, Globe, Check } from 'lucide-react';
import API_URL from '../config';

const Settings = () => {
    const admin = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    const [profile, setProfile] = useState({
        fullName: admin.fullName || '',
        email: admin.email || '',
        mobile: admin.mobile || '',
    });
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [passError, setPassError] = useState('');

    const headers = { Authorization: `Bearer ${admin.token}`, 'Content-Type': 'application/json' };

    const handleProfileSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/user/update`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(profile)
            });
            if (res.ok) {
                const data = await res.json();
                const updated = { ...admin, ...data };
                localStorage.setItem('adminInfo', JSON.stringify(updated));
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handlePasswordChange = async () => {
        setPassError('');
        if (passwords.newPass !== passwords.confirm) {
            setPassError('Passwords do not match');
            return;
        }
        if (passwords.newPass.length < 6) {
            setPassError('Password must be at least 6 characters');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/user/update`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ password: passwords.newPass })
            });
            if (res.ok) {
                setPasswords({ current: '', newPass: '', confirm: '' });
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fuchsia-500/50 transition-all";

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-slate-400 mt-1">Manage your admin account and platform settings</p>
            </div>

            {/* Save Feedback */}
            {saved && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm animate-pulse">
                    <Check className="w-4 h-4" /> Changes saved successfully!
                </div>
            )}

            {/* Profile Section */}
            <div className="bg-[#1a1b25] border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-fuchsia-400" /> Admin Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Full Name</label>
                        <input
                            type="text"
                            value={profile.fullName}
                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            className={`${inputClass} opacity-50 cursor-not-allowed`}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Mobile</label>
                        <input
                            type="text"
                            value={profile.mobile}
                            onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                            className={inputClass}
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>
                </div>

                <button
                    onClick={handleProfileSave}
                    disabled={saving}
                    className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl text-sm font-medium hover:from-fuchsia-500 hover:to-purple-500 shadow-lg shadow-fuchsia-900/20 transition-all disabled:opacity-50"
                >
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>

            {/* Password Section */}
            <div className="bg-[#1a1b25] border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                    <Key className="w-5 h-5 text-amber-400" /> Change Password
                </h3>

                {passError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm mb-4">
                        {passError}
                    </div>
                )}

                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">New Password</label>
                        <input
                            type="password"
                            value={passwords.newPass}
                            onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                            className={inputClass}
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className={inputClass}
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    onClick={handlePasswordChange}
                    disabled={saving || !passwords.newPass}
                    className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                >
                    <Key className="w-4 h-4" /> Update Password
                </button>
            </div>

            {/* Platform Config */}
            <div className="bg-[#1a1b25] border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                    <Globe className="w-5 h-5 text-cyan-400" /> Platform Configuration
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <div className="font-medium text-sm">Auto-approve courses</div>
                            <div className="text-xs text-slate-500 mt-0.5">Skip manual approval for new courses</div>
                        </div>
                        <button className="relative w-12 h-6 bg-slate-700 rounded-full transition-colors">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full transition-transform" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <div className="font-medium text-sm">Email notifications</div>
                            <div className="text-xs text-slate-500 mt-0.5">Receive email alerts for important events</div>
                        </div>
                        <button className="relative w-12 h-6 bg-fuchsia-600 rounded-full transition-colors">
                            <div className="absolute left-[26px] top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <div className="font-medium text-sm">Maintenance mode</div>
                            <div className="text-xs text-slate-500 mt-0.5">Show maintenance page to all non-admin users</div>
                        </div>
                        <button className="relative w-12 h-6 bg-slate-700 rounded-full transition-colors">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
