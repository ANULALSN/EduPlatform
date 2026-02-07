import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MessageCircle, User, Star, ChevronLeft, Users } from "lucide-react";
import API_URL from "./config";

const DUMMY_MENTORS = [
    {
        _id: "mentor1",
        fullName: "Dr. Arjun Kumar",
        avatar: "https://ui-avatars.com/api/?name=Arjun+Kumar&background=6366f1&color=fff",
        interests: ["MERN Stack", "React", "Node.js"],
        rating: 4.9,
        reviews: 156
    },
    {
        _id: "mentor2",
        fullName: "Sarah Johnson",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=ec4899&color=fff",
        interests: ["Data Science", "Python", "Machine Learning"],
        rating: 4.8,
        reviews: 98
    },
    {
        _id: "mentor3",
        fullName: "Mike Chen",
        avatar: "https://ui-avatars.com/api/?name=Mike+Chen&background=14b8a6&color=fff",
        interests: ["Flutter", "Mobile Development", "Dart"],
        rating: 4.7,
        reviews: 72
    },
    {
        _id: "mentor4",
        fullName: "Emily Rivera",
        avatar: "https://ui-avatars.com/api/?name=Emily+Rivera&background=f59e0b&color=fff",
        interests: ["UI/UX Design", "Figma", "Product Design"],
        rating: 5.0,
        reviews: 45
    },
    {
        _id: "mentor5",
        fullName: "David Park",
        avatar: "https://ui-avatars.com/api/?name=David+Park&background=8b5cf6&color=fff",
        interests: ["DevOps", "AWS", "Kubernetes"],
        rating: 4.6,
        reviews: 89
    }
];

const MentorsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const response = await fetch(`${API_URL}/chat/contacts?role=tutor&userId=${user._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.length === 0) {
                    setMentors(DUMMY_MENTORS);
                } else {
                    setMentors(data);
                }
            } else {
                setMentors(DUMMY_MENTORS);
            }
        } catch (error) {
            console.error("Failed to fetch mentors", error);
            setMentors(DUMMY_MENTORS);
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
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-400">
                        Find Mentors
                    </h1>
                </div>

                {/* Search */}
                <div className="relative mb-12 max-w-2xl">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Find Mentors by skill or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all backdrop-blur-sm"
                    />
                </div>

                {/* Mentors Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading mentors...</p>
                    </div>
                ) : filteredMentors.length === 0 ? (
                    <div className="text-center text-slate-500 py-20">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>No mentors found matching "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMentors.map((mentor) => (
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
                                            <span>{mentor.rating || 4.9}</span>
                                            <span className="text-slate-500 ml-1">({mentor.reviews || 0} Reviews)</span>
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
                                        to={mentor._id.startsWith("mentor") ? "/chat" : `/chat?mentor=${mentor._id}`}
                                        className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:scale-[1.02] active:scale-[0.98] text-sm font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Chat
                                    </Link>
                                </div>

                                {mentor._id.startsWith("mentor") && (
                                    <div className="mt-3 text-center">
                                        <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">Sample Mentor</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorsPage;
