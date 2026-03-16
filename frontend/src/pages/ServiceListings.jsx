import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useDebounce from '../hooks/useDebounce';

const ServiceListings = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || '';

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);
    
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState('recent');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = ['All', 'Tech & Dev', 'Design & Creative', 'Home Services', 'Tutoring', 'Writing', 'Event Planning', 'Fitness', 'Other'];

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                let url = `/api/services?page=${page}&limit=8&sort=${sort}`;
                
                if (debouncedSearch) {
                    url += `&keyword=${debouncedSearch}`;
                }
                
                if (category && category !== 'All') {
                    // For the backend, we might need to map these exact strings if different
                    url += `&category=${encodeURIComponent(category.split(' & ')[0])}`; 
                }

                const { data } = await axios.get(url);
                setServices(data.services);
                setTotalPages(data.pages);
            } catch (err) {
                setError('Failed to fetch services. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [debouncedSearch, category, sort, page]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page on new search
    };

    const handleCategoryChange = (c) => {
        setCategory(c);
        setPage(1);
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6"
            >
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Discover Services</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find the right people for your needs.</p>
                </div>
                
                {/* Search Bar */}
                <div className="w-full md:w-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-purple-400 group-focus-within:text-purple-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="w-full md:w-96 pl-12 pr-4 py-3 rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none dark:bg-slate-800/60 dark:border-slate-700/60 dark:focus:ring-purple-500 dark:focus:border-purple-500 dark:text-white"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <div className="glass-card p-6 rounded-3xl sticky top-24">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-4">
                            <Filter className="w-5 h-5 text-purple-600 dark:text-cyan-400" />
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Filters</h3>
                        </div>
                        
                        <div className="mb-8">
                            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Category</h4>
                            <div className="space-y-1">
                                {categories.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => handleCategoryChange(c)}
                                        className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                            (category === c || (category === '' && c === 'All'))
                                                ? 'bg-gradient-to-r from-purple-500/10 to-transparent text-purple-700 dark:from-cyan-500/20 dark:text-cyan-300 border-l-4 border-purple-500 dark:border-cyan-400 shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent dark:text-slate-400 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Sort By</h4>
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/70 backdrop-blur-sm transition-all focus:ring-2 focus:ring-cyan-400 outline-none dark:bg-slate-800/60 dark:border-slate-700/60 dark:text-white cursor-pointer"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Service Grid */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 border border-red-100 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="glass-card p-0 overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="h-48 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse"></div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200/50 dark:bg-slate-700/50 animate-pulse"></div>
                                            <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse w-24 rounded"></div>
                                        </div>
                                        <div className="h-6 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse w-3/4 rounded-md"></div>
                                        <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse w-full rounded"></div>
                                        <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse w-5/6 rounded mt-1"></div>
                                        <div className="flex justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                            <div className="h-6 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse w-16 rounded-md"></div>
                                            <div className="h-6 bg-slate-200/50 dark:bg-slate-700/50 animate-pulse w-16 rounded-md"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : services.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 glass-card rounded-3xl border border-slate-200/50 dark:border-slate-700/50"
                        >
                            <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No services found</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Try adjusting your search criteria or explore different categories.</p>
                            <button 
                                onClick={() => { setSearchTerm(''); setCategory('All'); setSort('recent'); }}
                                className="btn-glow inline-flex"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            >
                                {services.map((service) => (
                                    <motion.div key={service._id} variants={itemVariants}>
                                        <Link to={`/services/${service._id}`} className="block h-full glass-card hover:bg-white/90 dark:hover:bg-slate-800/80 rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                                            <div className="relative h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                {service.images && service.images.length > 0 ? (
                                                    <>
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                                                        <img 
                                                            src={service.images[0]} 
                                                            alt={service.title} 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                        />
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 text-purple-300 dark:text-slate-600">
                                                        <span className="font-bold tracking-wider uppercase opacity-50">No Image</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-lg flex items-center gap-1.5 z-20 transform group-hover:scale-110 transition-transform">
                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                    <span>{service.rating > 0 ? service.rating.toFixed(1) : 'New'}</span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                                                <div className="flex items-center gap-3 mb-4">
                                                    {service.providerId?.profilePicture ? (
                                                        <img src={service.providerId.profilePicture} alt={service.providerId.name} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800">
                                                            {service.providerId?.name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                                                        {service.providerId?.name}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">{service.title}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                                                    {service.description}
                                                </p>
                                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
                                                    <span className="text-xs font-semibold px-3 py-1.5 bg-purple-50 text-purple-700 dark:bg-cyan-900/20 dark:text-cyan-300 rounded-lg">
                                                        {service.category}
                                                    </span>
                                                    <span className="font-extrabold text-xl text-slate-900 dark:text-white">
                                                        ${service.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-12 flex items-center justify-center gap-2"
                                >
                                    <button 
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-md"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    
                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i + 1)}
                                                className={`w-12 h-12 rounded-xl font-bold transition-all text-sm ${
                                                    page === i + 1 
                                                        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                                                        : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800 hover:shadow-md'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-md"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceListings;
