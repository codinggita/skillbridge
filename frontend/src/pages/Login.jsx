import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);
    
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen dark:bg-indigo-500/10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen dark:bg-purple-500/10"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full max-w-md"
            >
                <div className="glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40 dark:border-slate-700/50 backdrop-blur-xl relative">
                    
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>

                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <motion.div 
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                                className="w-16 h-16 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner border border-white/50 dark:border-slate-600/50"
                            >
                                <LogIn className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </motion.div>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Enter your details to access your account</p>
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
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-indigo-400 outline-none dark:border-slate-700 dark:focus:ring-indigo-500 dark:text-white font-medium"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                                    <Link to="#" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-bold hover:underline transition-all">Forgot password?</Link>
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-indigo-400 outline-none dark:border-slate-700 dark:focus:ring-indigo-500 dark:text-white font-medium tracking-widest"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full btn-glow flex justify-center items-center py-4 rounded-xl text-lg font-bold shadow-lg shadow-indigo-500/30"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Sign in</span>
                                        <ArrowRight className="w-5 h-5 ml-1" />
                                    </div>
                                )}
                            </motion.button>
                        </form>
                    </div>
                    <div className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md p-6 border-t border-slate-100/50 dark:border-slate-800 text-center">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all">Sign up</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
