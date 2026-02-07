import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, CheckCircle, XCircle, Clock, User } from "lucide-react";
import API_URL from "./config";

const StudentRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("pending");
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        try {
            const response = await fetch(`${API_URL}/requests/mentor/${user._id}?status=${filter}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Error fetching requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, status) => {
        try {
            const response = await fetch(`${API_URL}/requests/${requestId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                fetchRequests();
            }
        } catch (error) {
            console.error("Error updating request", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-8">
            <header className="flex items-center gap-4 mb-8">
                <Link to="/dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-400">
                        Student Requests
                    </h1>
                    <p className="text-slate-400">Manage mentorship requests from students</p>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-8">
                {["pending", "accepted", "rejected"].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold capitalize transition-all border ${filter === status
                                ? "bg-fuchsia-600 border-fuchsia-500 text-white"
                                : "bg-slate-800/50 border-white/5 text-slate-400 hover:bg-white/5"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            {loading ? (
                <div className="text-center text-slate-500 py-20">Loading requests...</div>
            ) : requests.length === 0 ? (
                <div className="text-center text-slate-500 py-20">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No {filter} requests</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {requests.map(req => (
                        <div key={req._id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 flex items-center gap-6">
                            <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden border border-white/10">
                                <img
                                    src={req.student?.avatar || `https://ui-avatars.com/api/?name=${req.student?.fullName}`}
                                    alt={req.student?.fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{req.student?.fullName}</h3>
                                <p className="text-slate-400 text-sm">{req.student?.email}</p>
                                {req.message && (
                                    <p className="text-slate-300 text-sm mt-2 italic">"{req.message}"</p>
                                )}
                                {req.course && (
                                    <p className="text-fuchsia-400 text-xs mt-2">Course: {req.course?.title}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {filter === "pending" ? (
                                    <>
                                        <button
                                            onClick={() => handleAction(req._id, "accepted")}
                                            className="p-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleAction(req._id, "rejected")}
                                            className="p-3 bg-red-600 hover:bg-red-500 rounded-xl transition-colors"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${req.status === "accepted" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                        }`}>
                                        {req.status}
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-slate-500">
                                {new Date(req.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentRequestsPage;
