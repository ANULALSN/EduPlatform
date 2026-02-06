import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ChevronRight, Check } from "lucide-react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple Device Detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const deviceType = isMobile ? 'phone' : 'laptop';

        console.log("Login Attempt:", { email, deviceType });

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, deviceType }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login Successful:", data);
                localStorage.setItem("userInfo", JSON.stringify(data));
                navigate("/");
            } else {
                alert(data.message || "Login Failed");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white overflow-hidden relative">
            {/* Background Mesh */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "6s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md glass-card rounded-[2.5rem] overflow-hidden border border-white/20"
            >
                <div className="p-8 md:p-12 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-pink-600 mx-auto flex items-center justify-center text-2xl font-bold shadow-lg shadow-fuchsia-900/50 mb-6">
                            E
                        </div>
                        <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
                        <p className="text-slate-400 text-sm">Please sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm group-hover:bg-white/10 transition-colors" />
                                <Mail className="absolute left-5 top-4 w-5 h-5 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors z-10" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="relative z-10 w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-14 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all backdrop-blur-sm"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm group-hover:bg-white/10 transition-colors" />
                                <Lock className="absolute left-5 top-4 w-5 h-5 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors z-10" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="relative z-10 w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-14 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 rounded-md border border-white/20 bg-white/5 peer-checked:bg-fuchsia-600 peer-checked:border-fuchsia-500 transition-all"></div>
                                    <Check className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-medium">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-fuchsia-900/40 hover:shadow-fuchsia-600/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 border-t border-white/20"
                        >
                            Sign In
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-sm mt-8">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-white hover:text-fuchsia-300 font-semibold transition-colors border-b border-transparent hover:border-fuchsia-400 pb-0.5">
                            Create Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
