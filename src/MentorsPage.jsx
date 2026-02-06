import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MessageCircle, User, Star, ChevronLeft } from "lucide-react";
import API_URL from "./config";

const MentorsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const response = await fetch(`${API_URL}/chat/mentors`);
            if (response.ok) {
                const data = await response.json();
                setMentors(data);
            }
        } catch (error) {
            console.error("Failed to fetch mentors", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMentors = mentors.filter(mentor =>
        mentor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mentor.interests && mentor.interests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Find Tutors
                    </h1>
                </div>

                {/* Search */}
                <div className="relative mb-12 max-w-2xl">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Find Tutors by skill or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all backdrop-blur-sm"
                    />
                </div>

                {/* Mentors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-slate-400">Loading mentors...</p>
                    ) : filteredMentors.length > 0 ? (
                        filteredMentors.map((mentor) => (
                            <motion.div
                                key={mentor._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-800/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-fuchsia-500/30 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="relative">
                                        <img
                                            src={mentor.avatar || `https://ui-avatars.com/api/?name=${mentor.fullName}&background=random`}
                                            alt={mentor.fullName}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-fuchsia-500/30"
                                        />
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-fuchsia-400 font-bold">₹800/hr</div>
                                        <div className="flex items-center justify-end gap-1 text-amber-400 text-sm mt-1">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span>4.9</span>
                                            <span className="text-slate-500 ml-1">(120 Reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{mentor.fullName}</h3>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {mentor.interests?.slice(0, 3).map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-white/5 rounded-lg text-xs font-medium text-slate-300 border border-white/5">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/5">
                                        View Profile
                                    </button>
                                    <Link
                                        to={`/chat?mentor=${mentor._id}`}
                                        className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:scale-[1.02] active:scale-[0.98] text-sm font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Chat
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-slate-400 col-span-full text-center py-10">No mentors found matching your search.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MentorsPage;
