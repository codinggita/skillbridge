import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { PlusCircle, Image as ImageIcon, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateService = () => {
    const { authConfig } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Tech & Dev',
        price: '',
        imageUrl: '' // Simulating image upload via URL for simplicity
    });
    
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = ['Tech & Dev', 'Design & Creative', 'Home Services', 'Tutoring', 'Writing', 'Event Planning', 'Fitness', 'Other'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddImage = () => {
        if (formData.imageUrl.trim()) {
            setImages([...images, formData.imageUrl.trim()]);
            setFormData({ ...formData, imageUrl: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        try {
            await axios.post('/api/services', {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                price: Number(formData.price),
                images: images
            }, authConfig());
            
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || (err.message === 'Network Error' ? 'Network error: The backend server is unreachable. Please ensure it is running.' : 'Failed to create service.');
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
             {/* Background glowing effects */}
             <div className="absolute top-0 right-10 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen dark:bg-indigo-500/10"></div>
             <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen dark:bg-cyan-500/10"></div>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-10 flex items-center gap-5"
            >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/20 dark:to-cyan-500/20 rounded-2xl flex items-center justify-center shadow-inner border border-white/50 dark:border-slate-600/50">
                    <Briefcase className="w-8 h-8 text-indigo-600 dark:text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create a Service</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Offer your skills to the local community.</p>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
                className="glass-card p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-white/40 dark:border-slate-700/50 backdrop-blur-xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 bg-red-50/80 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400">
                        {error}
                    </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Service Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full px-5 py-4 rounded-xl border border-slate-200/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-indigo-400 outline-none dark:border-slate-700 dark:focus:ring-indigo-500 dark:text-white font-medium"
                            placeholder="e.g. Professional UI/UX Design for Web Apps"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    required
                                    className="w-full pl-5 pr-10 py-4 rounded-xl border border-slate-200/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-indigo-400 outline-none dark:border-slate-700 dark:focus:ring-indigo-500 dark:text-white font-medium appearance-none cursor-pointer"
                                    value={formData.category}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="1"
                                className="w-full px-5 py-4 rounded-xl border border-slate-200/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-amber-400 outline-none dark:border-slate-700 dark:focus:ring-amber-500 dark:text-white font-black text-lg"
                                placeholder="e.g. 50"
                                value={formData.price}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                        <textarea
                            name="description"
                            required
                            rows="5"
                            className="w-full px-5 py-4 rounded-xl border border-slate-200/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-indigo-400 outline-none dark:border-slate-700 dark:focus:ring-indigo-500 dark:text-white font-medium resize-none leading-relaxed"
                            placeholder="Describe what you offer, your experience, and what the client can expect..."
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        ></textarea>
                    </div>

                    {/* Image handling */}
                    <div className="bg-slate-50/50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 backdrop-blur-sm">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-indigo-500" />
                            Images (URLs)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <input
                                type="url"
                                name="imageUrl"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200/80 bg-white/60 dark:bg-slate-800/60 backdrop-blur transition-all shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none dark:border-slate-700 dark:text-white text-sm"
                                placeholder="https://example.com/image.jpg"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            <motion.button 
                                whileHover={!isSubmitting && formData.imageUrl ? { scale: 1.02 } : {}}
                                whileTap={!isSubmitting && formData.imageUrl ? { scale: 0.98 } : {}}
                                type="button"
                                onClick={handleAddImage}
                                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap shadow-sm transition-all ${isSubmitting || !formData.imageUrl ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500' : 'bg-white text-indigo-600 border border-indigo-100 hover:border-indigo-300 hover:shadow-md dark:bg-slate-800 dark:text-indigo-400 dark:border-slate-600 dark:hover:border-indigo-500'}`}
                                disabled={isSubmitting || !formData.imageUrl}
                            >
                                Add Image
                            </motion.button>
                        </div>
                        
                        <AnimatePresence>
                            {images.length > 0 && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-4 mt-6">
                                    {images.map((img, idx) => (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden shadow-md group">
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 w-7 h-7 flex items-center justify-center text-xs hover:bg-red-600 hover:scale-110 transition-all z-20 shadow-lg"
                                            >✕</button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {images.length === 0 && (
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-white/30 dark:bg-slate-800/30">
                                <ImageIcon className="w-10 h-10 mb-3 opacity-40 text-indigo-500" />
                                <span className="text-sm font-medium">No images added yet</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="pt-8 border-t border-slate-100/50 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-4 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto text-center"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            disabled={isSubmitting}
                            className="btn-glow flex justify-center items-center gap-2 py-4 px-8 rounded-xl font-bold text-lg w-full sm:w-auto shadow-lg shadow-indigo-500/30"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    Publishing...
                                </span>
                            ) : <><PlusCircle className="w-5 h-5" /> Publish Service</>}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateService;
