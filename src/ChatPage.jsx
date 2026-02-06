import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Send, Paperclip, ChevronLeft, Users, Radio } from "lucide-react";

const ChatPage = () => {
    const [searchParams] = useSearchParams();
    const initialMentorId = searchParams.get("mentor");

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [activeChat, setActiveChat] = useState(initialMentorId || null);
    const [chats, setChats] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [broadcastStack, setBroadcastStack] = useState("MERN");

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) setCurrentUser(user);

        // Fetch chat history or active chats list
        // For now, mocking the chat list
        fetchChats(user?._id);

        if (initialMentorId) {
            // Fetch specific chat history
            fetchHistory(user?._id, initialMentorId);
        }
    }, [initialMentorId]);

    const fetchChats = async (userId) => {
        // Mock data for side bar
        // Ideally fetch from /api/chat/history/userId
        setChats([
            { id: "1", name: "Arjun K", lastMsg: "See you at 5!", time: "10:30 AM", avatar: null, role: "Mentor" },
            { id: "2", name: "Sarah M", lastMsg: "Great progress!", time: "Yesterday", avatar: null, role: "Mentor" }
        ]);
    };

    const fetchHistory = async (userId, otherId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/chat/history/${userId}?otherUserId=${otherId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Error fetching history", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim() || !currentUser) return;

        const payload = {
            senderId: currentUser._id,
            content: message,
            type: "direct",
            receiverId: activeChat
        };

        try {
            const response = await fetch("http://localhost:5000/api/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const newMsg = await response.json();
                setMessages([...messages, newMsg]);
                setMessage("");
            }
        } catch (error) {
            console.error("Send failed", error);
        }
    };

    const handleBroadcast = async () => {
        if (!message.trim() || !currentUser) return;

        const payload = {
            senderId: currentUser._id,
            content: message,
            type: "broadcast",
            techStack: broadcastStack
        };

        try {
            const response = await fetch("http://localhost:5000/api/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const newMsg = await response.json();
                // Broadcast messages might not appear in a single chat window immediately
                // typically they go to multiple people.
                // For UX, we might just show an alert or add to a "Broadcasts" channel.
                alert(`Broadcast sent to all ${broadcastStack} Mentors!`);
                setShowBroadcastModal(false);
                setMessage("");
            } else {
                const err = await response.json();
                alert(`Failed: ${err.message}`);
            }
        } catch (error) {
            console.error("Broadcast failed", error);
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-slate-800/30 border-r border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold">Messages</h1>
                    </div>

                    <button
                        onClick={() => setShowBroadcastModal(true)}
                        className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-xl font-bold text-sm shadow-lg shadow-fuchsia-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Users className="w-4 h-4" />
                        Broadcast to Mentors
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-colors flex items-center gap-4 ${activeChat === chat.id ? "bg-white/10" : "hover:bg-white/5"}`}
                        >
                            <div className="relative">
                                <img
                                    src={chat.avatar || `https://ui-avatars.com/api/?name=${chat.name}&background=random`}
                                    alt={chat.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-sm truncate">{chat.name}</h4>
                                    <span className="text-xs text-slate-500">{chat.time}</span>
                                </div>
                                <p className="text-xs text-slate-400 truncate">{chat.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-900 relative">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 bg-slate-800/20 backdrop-blur-md flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg">Arjun K</h3>
                                <span className="px-2 py-0.5 bg-fuchsia-500/20 text-fuchsia-400 text-xs rounded-full border border-fuchsia-500/20">Mentor</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender._id === currentUser?._id ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[70%] p-4 rounded-2xl ${msg.sender._id === currentUser?._id
                                        ? "bg-fuchsia-600 text-white rounded-tr-none"
                                        : "bg-slate-800 border border-white/5 text-slate-200 rounded-tl-none"
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                        <span className="text-[10px] opacity-70 mt-2 block text-right">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 bg-slate-800/20 backdrop-blur-md">
                            <div className="flex items-center gap-3 max-w-4xl mx-auto">
                                <button className="p-3 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-xl">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type Message..."
                                    className="flex-1 bg-slate-800 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all placeholder-slate-500"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    className="p-3 bg-fuchsia-600 text-white rounded-xl shadow-lg shadow-fuchsia-900/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
                        <MessageCircle className="w-16 h-16 opacity-20" />
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </div>

            {/* Broadcast Modal */}
            {showBroadcastModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
                        <h2 className="text-xl font-bold mb-4">Broadcast Message</h2>
                        <p className="text-slate-400 text-sm mb-6">Send a message to all mentors proficient in a specific tech stack.</p>

                        <div className="space-y-4 mb-6">
                            <label className="text-sm font-medium text-slate-300">Select Tech Stack</label>
                            <div className="flex flex-wrap gap-2">
                                {["MERN", "Python", "Java", "Flutter", "DevOps"].map(stack => (
                                    <button
                                        key={stack}
                                        onClick={() => setBroadcastStack(stack)}
                                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${broadcastStack === stack ? "bg-fuchsia-600 border-fuchsia-500 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"}`}
                                    >
                                        {stack}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <label className="text-sm font-medium text-slate-300">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-fuchsia-500/50 resize-none"
                                placeholder="Hi, I'm looking for a mentor in..."
                            ></textarea>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowBroadcastModal(false)}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBroadcast}
                                className="flex-1 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-xl text-sm font-bold shadow-lg shadow-fuchsia-900/20 transition-colors"
                            >
                                Send Broadcast
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
