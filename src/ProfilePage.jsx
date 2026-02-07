import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Camera, Sparkles, ChevronLeft, Save, LogOut } from "lucide-react";
import API_URL from "./config";

const ProfilePage = () => {
    const navigate = useNavigate();
    // Mock user data - normally fetched from API/Context
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem("userInfo");
        return saved ? {
            ...JSON.parse(saved),
            mobile: JSON.parse(saved).mobile || "",
            gender: JSON.parse(saved).gender || "male" // Default to male if missing to avoid 'undefined'
        } : {
            fullName: "John Doe",
            email: "john@example.com",
            mobile: "+1234567890",
            gender: "male",
            avatar: null
        };
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(userData);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create local preview
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, avatar: previewUrl }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append("fullName", formData.fullName || "");
        submitData.append("mobile", formData.mobile || "");

        if (formData.gender) {
            submitData.append("gender", formData.gender);
        }
        // Add other fields if needed, but email is disabled usually

        if (selectedFile) {
            submitData.append("avatar", selectedFile);
        }

        try {
            // Assuming we have the user ID in userData._id or from localStorage
            // For now let's grab ID from localStorage if available
            const savedUser = JSON.parse(localStorage.getItem("userInfo"));
            if (!savedUser || !savedUser._id) {
                alert("Error: User ID not found. Please log in again.");
                return;
            }


            const response = await fetch(`${API_URL}/users/profile/${savedUser._id}`, {
                method: "PUT",
                body: submitData
            });

            const data = await response.json();

            if (response.ok) {
                setUserData(data);
                localStorage.setItem("userInfo", JSON.stringify(data));
                setIsEditing(false);
                alert("Profile Updated Successfully!");
            } else {
                alert(data.message || "Update Failed");
            }

        } catch (error) {
            console.error("Update Error:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-4 md:p-8 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl"
            >
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        My Profile
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="md:col-span-1">
                        <div className="glass-card rounded-[2rem] p-8 border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent pointer-events-none" />

                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-fuchsia-500 to-pink-500">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-900 bg-slate-800">
                                        <img
                                            src={formData.avatar || userData.avatar || `https://ui-avatars.com/api/?name=${userData.fullName}&background=random`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="profile-upload"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                        <label
                                            htmlFor="profile-upload"
                                            className="absolute bottom-2 right-2 p-2 bg-slate-800 rounded-full border border-white/20 text-white hover:bg-fuchsia-600 transition-colors shadow-lg cursor-pointer"
                                        >
                                            <Camera className="w-4 h-4" />
                                        </label>
                                    </>
                                )}
                                {!isEditing && (
                                    <button className="absolute bottom-2 right-2 p-2 bg-slate-800 rounded-full border border-white/20 text-white shadow-lg opacity-50 cursor-not-allowed">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">{userData.fullName}</h2>
                            <p className="text-fuchsia-400 text-sm font-medium uppercase tracking-wider mb-6">{userData.role || "Student"}</p>

                            <div className="w-full space-y-3 text-left">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-200 truncate">{userData.email}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-200">{userData.mobile}</span>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={() => {
                                    localStorage.removeItem("userInfo");
                                    navigate("/login");
                                }}
                                className="mt-6 w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="md:col-span-2">
                        <div className="glass-card rounded-[2rem] p-8 border border-white/10 bg-white/5 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold">Personal Information</h3>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${isEditing
                                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                        : "bg-fuchsia-600 text-white hover:bg-fuchsia-500 shadow-lg shadow-fuchsia-900/20"}`}
                                >
                                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Gender</label>
                                        <div className="relative">
                                            <select
                                                name="gender"
                                                value={formData.gender || ""}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white focus:outline-none focus:border-fuchsia-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all appearance-none"
                                            >
                                                <option value="male" className="bg-slate-900">Male</option>
                                                <option value="female" className="bg-slate-900">Female</option>
                                                <option value="other" className="bg-slate-900">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Mobile Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-400 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="pt-4 border-t border-white/5 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold shadow-lg shadow-fuchsia-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                                        >
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;
