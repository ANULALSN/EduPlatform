import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Upload, FileText, Award, Layers, Sparkles } from "lucide-react";

const ResumeBuilder = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // personal
        name: "", email: "", phone: "", linkedin: "", github: "", summary: "",
        // education
        education: "", institution: "", year: "", grades: "",
        // skills
        techStack: [], certifications: [],
        // projects
        projectTitle: "", techUsed: "", description: "", experience: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Generic list handler (for skills/tech stack)
    const addToList = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], value] }));
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const steps = [
        { num: 1, title: "Personal Details" },
        { num: 2, title: "Education, Skills" },
        { num: 3, title: "Projects Experience" }
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-4 md:p-8 flex justify-center items-center">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="mb-8 bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h1 className="text-2xl font-bold mb-2">AI RESUME BUILDER</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="text-sm font-semibold text-white">Step {step}: {steps[step - 1].title}</span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={`h-full flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-blue-600" : "bg-slate-600"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-slate-800/30 border border-white/10 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <h2 className="text-xl font-bold mb-6">BUILD YOUR RESUME</h2>
                                <Input label="NAME" name="name" value={formData.name} onChange={handleInputChange} />
                                <Input label="EMAIL ADDRESS" name="email" value={formData.email} onChange={handleInputChange} />
                                <Input label="PHONE NUMBER" name="phone" value={formData.phone} onChange={handleInputChange} />
                                <Input label="LINKEDIN URL" name="linkedin" value={formData.linkedin} onChange={handleInputChange} />
                                <Input label="GITHUB URL" name="github" value={formData.github} onChange={handleInputChange} />

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 ml-1">PROFESSIONAL SUMMARY</label>
                                    <textarea
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                                    ></textarea>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <h2 className="text-xl font-bold mb-6">BUILD YOUR RESUME</h2>
                                <Input label="EDUCATION" name="education" value={formData.education} onChange={handleInputChange} />
                                <Input label="INSTITUTION NAME" name="institution" value={formData.institution} onChange={handleInputChange} />
                                <Input label="YEAR OF PASSING" name="year" value={formData.year} onChange={handleInputChange} />
                                <Input label="GRADES/PERCENTAGE" name="grades" value={formData.grades} onChange={handleInputChange} />

                                {/* Dynamic Lists would go here - simplified for UI demo */}
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 cursor-pointer hover:bg-red-500/20 transition-colors">
                                    + Add More
                                </div>

                                <Input label="TECH STACK" name="techStack" placeholder="React, Node.js..." />
                                <Input label="CERTIFICATIONS" name="certifications" placeholder="AWS Cloud Practitioner..." />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <h2 className="text-xl font-bold mb-6">BUILD YOUR RESUME</h2>
                                <Input label="PROJECT TITLE" name="projectTitle" value={formData.projectTitle} onChange={handleInputChange} />
                                <Input label="TECH USED" name="techUsed" value={formData.techUsed} onChange={handleInputChange} />
                                <Input label="DESCRIPTION" name="description" value={formData.description} onChange={handleInputChange} />

                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 cursor-pointer hover:bg-red-500/20 transition-colors">
                                    + Add More
                                </div>

                                <Input label="EXPERIENCE" name="experience" value={formData.experience} onChange={handleInputChange} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/5">
                        {step === 1 ? (
                            <button className="px-6 py-2.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm font-bold border border-white/5 hover:bg-slate-700 transition-colors">
                                CLEAR ALL
                            </button>
                        ) : (
                            <button onClick={prevStep} className="px-6 py-2.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm font-bold border border-white/5 hover:bg-slate-700 transition-colors">
                                BACK
                            </button>
                        )}

                        {step < 3 ? (
                            <button onClick={nextStep} className="px-8 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors flex items-center gap-2">
                                NEXT <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button className="w-full max-w-sm mx-auto absolute bottom-8 left-0 right-0 px-8 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold shadow-lg shadow-fuchsia-900/50 transition-all flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Generate With AI
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Input = ({ label, name, value, onChange, placeholder }) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        {/* Helper button for array inputs could go here */}
    </div>
);

export default ResumeBuilder;
