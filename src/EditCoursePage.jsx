import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Trash2, Upload, Save, Video } from "lucide-react";
import API_URL from "./config";

const EditCoursePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

    const [course, setCourse] = useState({
        title: "",
        description: "",
        category: "",
        price: 0,
        thumbnail: "",
        modules: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await fetch(`${API_URL}/courses/${id}`);
            if (response.ok) {
                const data = await response.json();
                setCourse(data);
            }
        } catch (error) {
            console.error("Error fetching course", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddModule = () => {
        setCourse(prev => ({
            ...prev,
            modules: [...prev.modules, { title: "", videos: [] }]
        }));
    };

    const handleAddVideo = (moduleIndex) => {
        const updated = [...course.modules];
        updated[moduleIndex].videos.push({ title: "", url: "", duration: "" });
        setCourse(prev => ({ ...prev, modules: updated }));
    };

    const handleModuleChange = (index, field, value) => {
        const updated = [...course.modules];
        updated[index][field] = value;
        setCourse(prev => ({ ...prev, modules: updated }));
    };

    const handleVideoChange = (moduleIndex, videoIndex, field, value) => {
        const updated = [...course.modules];
        updated[moduleIndex].videos[videoIndex][field] = value;
        setCourse(prev => ({ ...prev, modules: updated }));
    };

    const handleRemoveModule = (index) => {
        setCourse(prev => ({
            ...prev,
            modules: prev.modules.filter((_, i) => i !== index)
        }));
    };

    const handleRemoveVideo = (moduleIndex, videoIndex) => {
        const updated = [...course.modules];
        updated[moduleIndex].videos = updated[moduleIndex].videos.filter((_, i) => i !== videoIndex);
        setCourse(prev => ({ ...prev, modules: updated }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`${API_URL}/courses/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(course)
            });
            if (response.ok) {
                alert("Course updated successfully!");
                navigate("/my-courses");
            } else {
                alert("Failed to update course");
            }
        } catch (error) {
            console.error("Error saving course", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <p className="text-slate-500">Loading course...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-8">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/my-courses" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                        <ChevronLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-400">
                            Edit Course
                        </h1>
                        <p className="text-slate-400">Update course content and modules</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                    <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Changes"}
                </button>
            </header>

            {/* Course Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 space-y-4">
                        <h2 className="font-bold text-lg mb-4">Course Details</h2>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Title</label>
                            <input
                                type="text"
                                value={course.title}
                                onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-slate-700/50 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-fuchsia-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Description</label>
                            <textarea
                                value={course.description}
                                onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full bg-slate-700/50 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-fuchsia-500/50 resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Category</label>
                                <input
                                    type="text"
                                    value={course.category}
                                    onChange={(e) => setCourse(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full bg-slate-700/50 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-fuchsia-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Price (₹)</label>
                                <input
                                    type="number"
                                    value={course.price}
                                    onChange={(e) => setCourse(prev => ({ ...prev, price: Number(e.target.value) }))}
                                    className="w-full bg-slate-700/50 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-fuchsia-500/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
                        <h2 className="font-bold text-lg mb-4">Thumbnail</h2>
                        <div className="aspect-video rounded-xl overflow-hidden bg-slate-700/50 mb-4">
                            <img
                                src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"}
                                alt="Thumbnail"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Thumbnail URL"
                            value={course.thumbnail}
                            onChange={(e) => setCourse(prev => ({ ...prev, thumbnail: e.target.value }))}
                            className="w-full bg-slate-700/50 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-fuchsia-500/50"
                        />
                        <p className="text-xs text-slate-500 mt-2">* Bunny.net integration coming soon</p>
                    </div>
                </div>
            </div>

            {/* Modules */}
            <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg">Modules & Videos</h2>
                    <button
                        onClick={handleAddModule}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Module
                    </button>
                </div>

                {course.modules?.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                        <Video className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No modules yet. Click "Add Module" to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {course.modules?.map((module, mIdx) => (
                            <div key={mIdx} className="bg-slate-700/30 border border-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-fuchsia-400 font-bold">Module {mIdx + 1}</span>
                                    <input
                                        type="text"
                                        placeholder="Module Title"
                                        value={module.title}
                                        onChange={(e) => handleModuleChange(mIdx, "title", e.target.value)}
                                        className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-fuchsia-500/50"
                                    />
                                    <button
                                        onClick={() => handleRemoveModule(mIdx)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Videos */}
                                <div className="pl-4 space-y-2">
                                    {module.videos?.map((video, vIdx) => (
                                        <div key={vIdx} className="flex items-center gap-3 bg-slate-800/30 rounded-lg p-3">
                                            <Video className="w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="Video Title"
                                                value={video.title}
                                                onChange={(e) => handleVideoChange(mIdx, vIdx, "title", e.target.value)}
                                                className="flex-1 bg-transparent border-b border-white/10 py-1 text-sm focus:outline-none focus:border-fuchsia-500/50"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Video URL"
                                                value={video.url}
                                                onChange={(e) => handleVideoChange(mIdx, vIdx, "url", e.target.value)}
                                                className="flex-1 bg-transparent border-b border-white/10 py-1 text-sm focus:outline-none focus:border-fuchsia-500/50"
                                            />
                                            <button
                                                onClick={() => handleRemoveVideo(mIdx, vIdx)}
                                                className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleAddVideo(mIdx)}
                                        className="flex items-center gap-2 text-xs text-fuchsia-400 hover:text-fuchsia-300 py-2"
                                    >
                                        <Plus className="w-3 h-3" /> Add Video
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditCoursePage;
