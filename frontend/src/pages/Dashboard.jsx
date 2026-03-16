import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, CheckCircle, XCircle, Briefcase, Plus, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, authConfig } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const endpoint = user.role === 'provider' ? '/api/bookings/provider' : '/api/bookings/client';
                const { data } = await axios.get(endpoint, authConfig());
                setBookings(data);
            } catch (err) {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await axios.put(`/api/bookings/${bookingId}/status`, { status: newStatus }, authConfig());
            setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        } catch (err) {
            alert('Failed to update booking status');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 dark:text-yellow-400',
            accepted: 'bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400',
            completed: 'bg-green-500/10 text-green-600 border border-green-500/20 dark:text-green-400',
            rejected: 'bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400',
            cancelled: 'bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400'
        };

        const icons = {
            pending: <Clock className="w-3.5 h-3.5" />,
            accepted: <CheckCircle className="w-3.5 h-3.5" />,
            completed: <CheckCircle className="w-3.5 h-3.5" />,
            rejected: <XCircle className="w-3.5 h-3.5" />,
            cancelled: <XCircle className="w-3.5 h-3.5" />
        };

        return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm ${styles[status]}`}>
                {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse space-y-8">
                    <div className="flex justify-between items-end">
                        <div className="space-y-3">
                            <div className="h-10 bg-slate-200 dark:bg-slate-700/50 rounded-xl w-64"></div>
                            <div className="h-5 bg-slate-200 dark:bg-slate-700/50 rounded-lg w-48"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700/50 rounded-3xl"></div>
                        ))}
                    </div>
                    <div className="h-96 bg-slate-200 dark:bg-slate-700/50 rounded-3xl mt-8"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            {/* Background Blob Effects */}
            <div className="absolute top-10 right-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
            >
                <div className="flex items-center gap-4">
                    {user?.profilePicture ? (
                         <img src={user.profilePicture} alt={user.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-800" />
                    ) : (
                         <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-white dark:border-slate-800">
                             {user?.name?.charAt(0) || <User />}
                         </div>
                    )}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.name}</span></p>
                    </div>
                </div>
                
                {user?.role === 'provider' && (
                    <Link to="/create-service" className="btn-glow flex items-center gap-2 group">
                        <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                        <span>Create Service</span>
                    </Link>
                )}
            </motion.div>

            {/* Quick Stats Overview */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
                <motion.div variants={itemVariants} className="glass-card p-6 rounded-[2rem] border-t-8 border-t-indigo-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Bookings</p>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2 font-mono tracking-tight">{bookings.length}</h3>
                        </div>
                        <div className="p-4 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-2xl shadow-sm">
                            <Briefcase className="w-7 h-7" />
                        </div>
                    </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="glass-card p-6 rounded-[2rem] border-t-8 border-t-amber-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                     <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Requests</p>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2 font-mono tracking-tight">
                                {bookings.filter(b => b.status === 'pending').length}
                            </h3>
                        </div>
                        <div className="p-4 bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 rounded-2xl shadow-sm">
                            <Clock className="w-7 h-7" />
                        </div>
                    </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="glass-card p-6 rounded-[2rem] border-t-8 border-t-emerald-500 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                     <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed Jobs</p>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2 font-mono tracking-tight">
                                {bookings.filter(b => b.status === 'completed').length}
                            </h3>
                        </div>
                        <div className="p-4 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 rounded-2xl shadow-sm">
                            <CheckCircle className="w-7 h-7" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bookings List */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="glass-card overflow-hidden rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
            >
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                        {user?.role === 'provider' ? 'Incoming Requests' : 'Your Bookings'}
                    </h3>
                </div>
                
                <div className="p-0">
                    <AnimatePresence mode="wait">
                        {error ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-red-500 font-medium">{error}</motion.div>
                        ) : bookings.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 text-center">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Briefcase className="w-10 h-10 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active bookings yet</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">When you book a service or receive a request, it will show up here.</p>
                                {user?.role === 'user' && (
                                    <Link to="/services" className="btn-secondary inline-flex items-center gap-2">
                                        Explore Services <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </motion.div>
                        ) : (
                            <motion.ul variants={containerVariants} initial="hidden" animate="visible" className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {bookings.map((booking) => (
                                    <motion.li key={booking._id} variants={itemVariants} className="p-6 sm:p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                            
                                            <div className="flex items-start gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-shrink-0 items-center justify-center font-bold text-xl text-white shadow-md group-hover:scale-105 transition-transform">
                                                    {user?.role === 'provider' ? booking.clientId?.name?.charAt(0) : booking.providerId?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {booking.serviceId?.title || 'Unknown Service'}
                                                    </h4>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                                        {user?.role === 'provider' ? `Requested by ${booking.clientId?.name}` : `Provider: ${booking.providerId?.name}`}
                                                    </p>
                                                    {booking.scheduledDate && (
                                                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 w-fit px-2.5 py-1 rounded-md">
                                                            <Calendar className="w-3.5 h-3.5" /> {new Date(booking.scheduledDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-start md:items-end gap-3 mt-2 md:mt-0">
                                                <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 mb-2">
                                                     <div className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">${booking.serviceId?.price}</div>
                                                     {getStatusBadge(booking.status)}
                                                </div>
                                                
                                                {/* Action Buttons based on Role & Status */}
                                                {user?.role === 'provider' && booking.status === 'pending' && (
                                                    <div className="flex gap-3 mt-1 w-full md:w-auto">
                                                        <button onClick={() => handleStatusUpdate(booking._id, 'accepted')} className="flex-1 md:flex-none text-sm font-bold px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all active:scale-95">Accept</button>
                                                        <button onClick={() => handleStatusUpdate(booking._id, 'rejected')} className="flex-1 md:flex-none text-sm font-bold px-5 py-2.5 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all active:scale-95">Decline</button>
                                                    </div>
                                                )}
                                                {user?.role === 'provider' && booking.status === 'accepted' && (
                                                    <button onClick={() => handleStatusUpdate(booking._id, 'completed')} className="w-full md:w-auto text-sm font-bold px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all active:scale-95 mt-1">Mark Complete</button>
                                                )}
                                                {user?.role === 'user' && booking.status === 'pending' && (
                                                    <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="w-full md:w-auto text-sm font-bold px-5 py-2.5 bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-500/30 transition-all active:scale-95 mt-1 border border-red-200 dark:border-red-500/30">Cancel Request</button>
                                                )}
                                            </div>

                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
