import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ArrowRight, Briefcase, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' // Default to user (client)
    });
    
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { signup, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        
        setIsSubmitting(true);
        
        try {
            await signup(formData.name, formData.email, formData.password, formData.role);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
             {/* Background glowing effects */}
             <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen dark:bg-cyan-500/10"></div>
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen dark:bg-purple-500/10"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full max-w-xl"
            >
                <div className="glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40 dark:border-slate-700/50 backdrop-blur-xl relative">
                    
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500"></div>

                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-10">
                            <motion.div 
                                initial={{ rotate: 180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                                className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner border border-white/50 dark:border-slate-600/50"
                            >
                                <UserPlus className="w-8 h-8 text-purple-600 dark:text-cyan-400" />
                            </motion.div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create an account</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Join SkillBridge and start connecting today</p>
                        </div>
                        
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800/30 backdrop-blur-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">I want to...</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`
                                        cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center text-center transition-all bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm relative overflow-hidden group hover:shadow-lg hover:-translate-y-1
                                        ${formData.role === 'user' 
                                            ? 'border-purple-600 shadow-md ring-2 ring-purple-600/20 dark:border-cyan-400 dark:ring-cyan-400/20' 
                                            : 'border-slate-200/80 dark:border-slate-700 hover:border-purple-300 dark:hover:border-cyan-700'}
                                    `}>
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="user" 
                                            checked={formData.role === 'user'} 
                                            onChange={handleChange} 
                                            className="sr-only" 
                                        />
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${formData.role === 'user' ? 'bg-purple-100 text-purple-600 dark:bg-cyan-900/40 dark:text-cyan-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700/50'}`}>
                                             <Search className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white mb-1">Client Account</span>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-tight">Hire locals for micro-jobs</span>
                                        {formData.role === 'user' && <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 dark:bg-cyan-500/10 rounded-bl-full border-b border-l border-purple-500/20 dark:border-cyan-500/20 blur-sm"></div>}
                                    </label>
                                    
                                    <label className={`
                                        cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center text-center transition-all bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm relative overflow-hidden group hover:shadow-lg hover:-translate-y-1
                                        ${formData.role === 'provider' 
                                            ? 'border-indigo-600 shadow-md ring-2 ring-indigo-600/20 dark:border-indigo-400 dark:ring-indigo-400/20' 
                                            : 'border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'}
                                    `}>
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="provider" 
                                            checked={formData.role === 'provider'} 
                                            onChange={handleChange} 
                                            className="sr-only" 
                                        />
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${formData.role === 'provider' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700/50'}`}>
                                             <Briefcase className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white mb-1">Provider Account</span>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-tight">Offer services and earn</span>
                                        {formData.role === 'provider' && <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-bl-full border-b border-l border-indigo-500/20 blur-sm"></div>}
                                    </label>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-purple-400 outline-none dark:border-slate-700 dark:focus:ring-cyan-500 dark:text-white font-medium"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-purple-400 outline-none dark:border-slate-700 dark:focus:ring-cyan-500 dark:text-white font-medium"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-purple-400 outline-none dark:border-slate-700 dark:focus:ring-cyan-500 dark:text-white font-medium tracking-widest"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        minLength="6"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-purple-400 outline-none dark:border-slate-700 dark:focus:ring-cyan-500 dark:text-white font-medium tracking-widest"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        minLength="6"
                                    />
                                </div>
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full ${formData.role === 'provider' ? 'btn-glow' : 'btn-glow'} flex justify-center items-center py-4 rounded-xl text-lg font-bold shadow-lg shadow-purple-500/30 mt-6`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Create Account</span>
                                        <ArrowRight className="w-5 h-5 ml-1" />
                                    </div>
                                )}
                            </motion.button>
                            
                            <p className="text-xs text-center font-medium text-slate-500 dark:text-slate-400 mt-6">
                                By signing up, you agree to our <a href="#" className="underline hover:text-purple-600 transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-purple-600 transition-colors">Privacy Policy</a>.
                            </p>
                        </form>
                    </div>
                    <div className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md p-6 border-t border-slate-100/50 dark:border-slate-800 text-center">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-600 dark:text-cyan-400 font-bold hover:underline transition-all">Log in instead</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
