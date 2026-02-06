import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, User, Mail, Lock, Code, ChevronRight, Briefcase, Phone, Sparkles } from "lucide-react";
import API_URL from "./config";

const RegisterPage = () => {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    gender: "",
    avatar: null,
    avatarPreview: null,
  });
  const [selectedInterests, setSelectedInterests] = useState([]);

  const studentInterests = [
    "React", "Node.js", "Python", "AI/ML", "Java", "Flutter",
    "Data Science", "Cybersecurity", "Cloud Computing"
  ];
  const tutorExpertise = [
    "Web Dev", "Data Structures", "Algorithms", "System Design",
    "DevOps", "Mobile Dev", "Blockchain", "Game Dev", "Cloud"
  ];

  const techOptions = role === "student" ? studentInterests : tutorExpertise;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", { ...formData, role, selectedInterests });

    const submitData = new FormData();
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email);
    submitData.append("mobile", formData.mobile);
    submitData.append("password", formData.password);
    submitData.append("gender", formData.gender);
    submitData.append("role", role);
    submitData.append("interests", JSON.stringify(selectedInterests)); // Send as string
    if (formData.avatar) {
      submitData.append("avatar", formData.avatar);
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful! Redirecting to Login...");
        navigate("/login");
      } else {
        alert(data.message || "Registration Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg md:max-w-2xl glass-card rounded-[2.5rem] overflow-hidden border border-white/20"
      >
        <div className="p-8 md:p-12 relative">
          {/* Decorative shine */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

          {/* Header & Role Switcher */}
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-fuchsia-200 drop-shadow-sm">
              Create Account
            </h1>

            <div className="relative flex bg-black/20 backdrop-blur-md rounded-full p-1.5 border border-white/10 shadow-inner">
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 shadow-lg shadow-fuchsia-900/40 border border-white/10 ${role === "tutor" ? "left-[calc(50%+3px)]" : "left-1.5"
                  }`}
              />
              <button
                onClick={() => setRole("student")}
                className={`relative z-10 px-8 py-2.5 text-sm font-semibold rounded-full transition-colors duration-200 ${role === "student" ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
              >
                Student
              </button>
              <button
                onClick={() => setRole("tutor")}
                className={`relative z-10 px-8 py-2.5 text-sm font-semibold rounded-full transition-colors duration-200 ${role === "tutor" ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
              >
                Mentor
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload - Liquid Style */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="cursor-pointer block relative">
                  <div className={`w-28 h-28 rounded-full border-4 ${formData.avatarPreview ? 'border-fuchsia-500' : 'border-white/10'} flex items-center justify-center overflow-hidden bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md group-hover:scale-105 transition-all duration-300 shadow-2xl`}>
                    {formData.avatarPreview ? (
                      <img src={formData.avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-10 h-10 text-white/50 group-hover:text-fuchsia-400 transition-colors" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 p-2.5 rounded-full shadow-lg border-2 border-slate-900 hover:scale-110 transition-transform">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                </label>
              </div>
              <p className="text-sm font-medium text-slate-400 mt-3">Upload profile photo</p>
            </div>

            {/* Glass Inputs */}
            <div className="space-y-5">
              {[
                { icon: User, name: "fullName", placeholder: "Full Name", type: "text" },
                { icon: Mail, name: "email", placeholder: "Email Address", type: "email" },
                { icon: Phone, name: "mobile", placeholder: "Mobile Number", type: "tel" },
              ].map((field, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm group-hover:bg-white/10 transition-colors" />
                  <field.icon className="absolute left-5 top-4 w-5 h-5 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors z-10" />
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="relative z-10 w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-14 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all backdrop-blur-sm"
                  />
                </div>
              ))}

              <div className="relative group">
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm group-hover:bg-white/10 transition-colors" />
                <User className="absolute left-5 top-4 w-5 h-5 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors z-10" />
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="relative z-10 w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-14 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all backdrop-blur-sm appearance-none"
                >
                  <option value="" className="bg-slate-900 text-slate-400">Select Gender</option>
                  <option value="male" className="bg-slate-900 text-white">Male</option>
                  <option value="female" className="bg-slate-900 text-white">Female</option>
                  <option value="other" className="bg-slate-900 text-white">Other</option>
                </select>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm group-hover:bg-white/10 transition-colors" />
                <Lock className="absolute left-5 top-4 w-5 h-5 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors z-10" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="relative z-10 w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-14 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Bubble Interests */}
            <div className="pt-4">
              <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2 px-1">
                {role === "student" ? <Code className="w-4 h-4 text-fuchsia-400" /> : <Briefcase className="w-4 h-4 text-fuchsia-400" />}
                {role === "student" ? "Select your interests" : "Select your expertise"}
              </label>
              <div className="flex flex-wrap gap-2.5">
                {techOptions.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleInterest(tech)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium border transition-all duration-300 active:scale-95 ${selectedInterests.includes(tech)
                      ? "bg-gradient-to-r from-fuchsia-600/80 to-pink-600/80 border-white/20 text-white shadow-lg shadow-fuchsia-900/20 backdrop-blur-md"
                      : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/10 backdrop-blur-sm"
                      }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-fuchsia-900/40 hover:shadow-fuchsia-600/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-6 border-t border-white/20"
            >
              Create Account
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Footer */}
            <p className="text-center text-slate-400 text-sm mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:text-fuchsia-300 font-semibold transition-colors border-b border-transparent hover:border-fuchsia-400 pb-0.5">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
