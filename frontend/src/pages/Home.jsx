import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Zap, Shield, Star, Briefcase, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    
    // Parallax background effects
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

    // Typing effect logic
    const titles = ["a Developer", "a Designer", "a Tutor", "a Handyman"];
    const [titleIndex, setTitleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTitleIndex((prev) => (prev + 1) % titles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/services?keyword=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", bounce: 0.4 } }
    };
    
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob dark:opacity-20"></div>
                <div className="absolute top-0 -right-40 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 dark:opacity-20"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 dark:opacity-20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Hero Section */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 text-center"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-purple-600 dark:text-cyan-400 mb-8 cursor-pointer hover:scale-105 transition-transform">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                        SkillBridge 2.0 is live! Sign up today.
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
                        Exchange Skills.<br className="hidden md:block" />
                        <span className="text-gradient dark:text-gradient-dark">Build Community.</span>
                    </motion.h1>
                    
                    <motion.div variants={fadeInUp} className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 h-10">
                        Hire <motion.span 
                                key={titleIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="font-semibold text-purple-600 dark:text-cyan-400 inline-block"
                             >
                                {titles[titleIndex]}
                             </motion.span> right in your neighborhood.
                    </motion.div>

                    {/* Search Bar Overview */}
                    <motion.form 
                        variants={fadeInUp}
                        onSubmit={handleSearch}
                        className="max-w-2xl mx-auto mb-12 relative z-20 group"
                    >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-purple-400 group-focus-within:text-purple-600 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="What do you need help with? (e.g. Web Design)" 
                            className="w-full pl-14 pr-32 py-5 rounded-2xl border border-white/40 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold rounded-xl px-6 transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-95"
                        >
                            Search
                        </button>
                    </motion.form>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/services" className="btn-glow px-8 py-4 text-lg w-full sm:w-auto flex items-center justify-center gap-2">
                            Explore Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/signup" className="btn-secondary px-8 py-4 text-lg w-full sm:w-auto">
                            Become a Provider
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <div className="py-24 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                            Why choose SkillBridge?
                        </h2>
                    </motion.div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-8 relative"
                    >
                        {[
                            { icon: Zap, title: "Lightning Fast", desc: "Find local service providers quickly and message them directly to get your job done faster.", color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
                            { icon: Shield, title: "Verified Community", desc: "All local providers are reviewed by neighbors, ensuring you get high quality and reliable service.", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
                            { icon: StarIcon, title: "Local Talent", desc: "Discover hidden gems in your own city. Help neighbors build their small micro-service businesses.", color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" }
                        ].map((feature, idx) => (
                            <motion.div 
                                key={idx}
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                className="glass-card p-10 rounded-3xl text-center group"
                            >
                                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Categories Preview */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto py-20 relative z-10"
                >
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Popular Categories</h2>
                            <p className="text-slate-600 dark:text-slate-400">Find what you need in your neighborhood</p>
                        </div>
                        <Link to="/services" className="hidden sm:flex items-center text-purple-600 dark:text-cyan-400 font-medium hover:underline group">
                            View all <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {['Tech & Dev', 'Design & Creative', 'Home Services', 'Tutoring', 'Writing', 'Event Planning', 'Fitness', 'Other'].map((cat, idx) => (
                            <motion.div key={idx} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <Link to={`/services?category=${cat}`} className="card glass-card p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-full">
                                    <Briefcase className="w-8 h-8 text-purple-400 dark:text-cyan-500 mb-3" />
                                    <h3 className="font-bold text-slate-900 dark:text-white">{cat}</h3>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                    
                    <Link to="/services" className="sm:hidden flex items-center justify-center mt-8 text-purple-600 dark:text-cyan-400 font-medium hover:underline">
                       View all categories <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </motion.div>

                {/* CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', bounce: 0.4 }}
                    className="my-24 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-[2.5rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden"
                >
                    {/* Inner glow/texture */}
                    <div className="absolute inset-0 bg-white/5 opacity-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">Ready to share your skills?</h2>
                        <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-xl font-medium tracking-wide">
                            Join thousands of locals who are exchanging services, building networks, and earning money doing what they love.
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/signup" className="inline-block bg-white text-purple-700 font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg tracking-wide">
                                Join SkillBridge Today
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Fallback component
const StarIcon = (props) => <Star {...props} />;

export default Home;
