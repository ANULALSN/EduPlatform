import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Trash, Upload, Save } from "lucide-react";
import API_URL from "./config";

const CreateCoursePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [course, setCourse] = useState({
        title: "",
        description: "",
        category: "Web Development",
        price: 0,
        thumbnail: "",
        modules: [
            { title: "Introduction", videos: [{ title: "Welcome", url: "", duration: "" }] }
        ]
    });

    const categories = ["Web Development", "Data Science", "Mobile Development", "UI/UX Design", "DevOps", "Cybersecurity"];

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleModuleChange = (index, field, value) => {
        const newModules = [...course.modules];
        newModules[index][field] = value;
        setCourse({ ...course, modules: newModules });
    };

    const addModule = () => {
        setCourse({
            ...course,
            modules: [...course.modules, { title: "", videos: [{ title: "", url: "", duration: "" }] }]
        });
    };

    const removeModule = (index) => {
        const newModules = course.modules.filter((_, i) => i !== index);
        setCourse({ ...course, modules: newModules });
    };

    const handleVideoChange = (modIndex, vidIndex, field, value) => {
        const newModules = [...course.modules];
        newModules[modIndex].videos[vidIndex][field] = value;
        setCourse({ ...course, modules: newModules });
    };

    const addVideo = (modIndex) => {
        const newModules = [...course.modules];
        newModules[modIndex].videos.push({ title: "", url: "", duration: "" });
        setCourse({ ...course, modules: newModules });
    };

    const removeVideo = (modIndex, vidIndex) => {
        const newModules = [...course.modules];
        newModules[modIndex].videos = newModules[modIndex].videos.filter((_, i) => i !== vidIndex);
        setCourse({ ...course, modules: newModules });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const user = JSON.parse(localStorage.getItem("userInfo"));
            if (!user || user.role !== "tutor") {
                setError("Only mentors can create courses.");
                setLoading(false);
                return;
            }

            const payload = {
                ...course,
                mentorId: user._id
            };

            const response = await fetch(`${API_URL}/courses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Course Created Successfully!");
                navigate("/dashboard");
            } else {
                const data = await response.json();
                setError(data.message || "Failed to create course");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-bold">Create New Course</h1>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Details */}
                    <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6 text-fuchsia-400">Course Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Course Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={course.title}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-fuchsia-500 outline-none"
                                    placeholder="e.g. Master ReactJS"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={course.description}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-fuchsia-500 outline-none h-32 resize-none"
                                    placeholder="Course description..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={course.category}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-fuchsia-500 outline-none"
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={course.price}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-fuchsia-500 outline-none"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modules */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-fuchsia-400">Course Content</h2>
                            <button
                                type="button"
                                onClick={addModule}
                                className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600/20 text-fuchsia-400 rounded-lg hover:bg-fuchsia-600/30 transition"
                            >
                                <Plus className="w-4 h-4" /> Add Module
                            </button>
                        </div>

                        {course.modules.map((module, mIdx) => (
                            <div key={mIdx} className="bg-slate-800/30 border border-white/10 rounded-2xl p-6 relative">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold text-lg">Module {mIdx + 1}</h3>
                                    {course.modules.length > 1 && (
                                        <button type="button" onClick={() => removeModule(mIdx)} className="text-red-500 hover:text-red-400">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={module.title}
                                    onChange={(e) => handleModuleChange(mIdx, "title", e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 mb-4 focus:border-fuchsia-500 outline-none"
                                    placeholder="Module Title"
                                    required
                                />

                                <div className="space-y-3 pl-4 border-l-2 border-white/5">
                                    {module.videos.map((video, vIdx) => (
                                        <div key={vIdx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                            <div>
                                                <label className="text-xs text-slate-500">Video Title</label>
                                                <input
                                                    type="text"
                                                    value={video.title}
                                                    onChange={(e) => handleVideoChange(mIdx, vIdx, "title", e.target.value)}
                                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm focus:border-fuchsia-500 outline-none"
                                                    placeholder="Video Title"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500">Video URL</label>
                                                <input
                                                    type="url"
                                                    value={video.url}
                                                    onChange={(e) => handleVideoChange(mIdx, vIdx, "url", e.target.value)}
                                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm focus:border-fuchsia-500 outline-none"
                                                    placeholder="https://..."
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <label className="text-xs text-slate-500">Duration</label>
                                                    <input
                                                        type="text"
                                                        value={video.duration}
                                                        onChange={(e) => handleVideoChange(mIdx, vIdx, "duration", e.target.value)}
                                                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-sm focus:border-fuchsia-500 outline-none"
                                                        placeholder="10:00"
                                                    />
                                                </div>
                                                {module.videos.length > 1 && (
                                                    <button type="button" onClick={() => removeVideo(mIdx, vIdx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addVideo(mIdx)}
                                        className="text-sm text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 mt-2"
                                    >
                                        <Plus className="w-3 h-3" /> Add Video
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-6 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-fuchsia-900/20 transition-all flex items-center gap-2"
                        >
                            {loading ? "Saving..." : <><Save className="w-5 h-5" /> Publish Course</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCoursePage;
