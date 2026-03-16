import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star, Clock, User, ShieldCheck, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, authConfig } = useAuth();
    
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
    const [scheduledDate, setScheduledDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const { data } = await axios.get(`/api/services/${id}`);
                setService(data);
            } catch (err) {
                setError('Service not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: `/services/${id}` } } });
            return;
        }

        if (!scheduledDate) {
            alert('Please select a date for the service');
            return;
        }

        setBookingLoading(true);
        try {
            await axios.post('/api/bookings', {
                serviceId: service._id,
                scheduledDate
            }, authConfig());
            
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to request booking');
        } finally {
            setBookingLoading(false);
            setIsBookingDetailsOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl w-full"></div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 w-3/4 rounded-lg"></div>
                            <div className="h-32 bg-gray-200 dark:bg-gray-700 w-full rounded-lg"></div>
                        </div>
                        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h2>
                <button onClick={() => navigate('/services')} className="btn-primary">Browse other services</button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button 
                onClick={() => navigate('/services')} 
                className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" /> Back to Services
            </button>

            {/* Images Gallery Header */}
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10 bg-gray-100 dark:bg-gray-800">
                {service.images && service.images.length > 0 ? (
                    <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-16 h-16 opacity-20" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                    <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium px-3 py-1 rounded-full text-xs">
                                {service.category}
                            </span>
                            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                                <Star className="w-4 h-4 fill-amber-500" />
                                {service.rating > 0 ? service.rating.toFixed(1) : 'New'}
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                            {service.title}
                        </h1>
                        <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            {service.description}
                        </p>
                    </div>

                    {/* About the Seller */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">About the Provider</h3>
                        <div className="flex items-start gap-4">
                            {service.providerId?.profilePicture ? (
                                <img src={service.providerId.profilePicture} alt={service.providerId.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 flex items-center justify-center text-xl font-bold text-indigo-700 dark:text-indigo-300 shadow-sm border-2 border-white dark:border-gray-800">
                                    {service.providerId?.name?.charAt(0) || 'U'}
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    {service.providerId?.name}
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                </h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{service.providerId?.bio || 'No biography provided.'}</p>
                                <div className="flex flex-wrap gap-2">
                                    {service.providerId?.skills?.map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Sidebar Panel */}
                <div className="md:col-span-1">
                    <div className="card sticky top-24 p-6 border-2 border-indigo-50 dark:border-indigo-900/20 shadow-lg">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${service.price}</h3>
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">per service</span>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Clock className="w-5 h-5 text-indigo-500" />
                                <span>Fast delivery guaranteed</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                                <span>Trusted local professional</span>
                            </div>
                        </div>

                        {service.providerId?._id === user?._id ? (
                            <button disabled className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold rounded-xl cursor-not-allowed">
                                This is your service
                            </button>
                        ) : isBookingDetailsOpen ? (
                            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            className="input-field pl-10"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsBookingDetailsOpen(false)}
                                        className="w-1/3 btn-secondary"
                                    >Cancel</button>
                                    <button 
                                        onClick={handleBooking}
                                        disabled={bookingLoading || !scheduledDate}
                                        className="w-2/3 btn-primary text-center"
                                    >
                                        {bookingLoading ? 'Confirming...' : 'Confirm Request'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => user ? setIsBookingDetailsOpen(true) : navigate('/login', { state: { from: { pathname: `/services/${id}` } } })}
                                className="w-full btn-primary py-3 text-lg"
                            >
                                Request Service
                            </button>
                        )}
                        
                        <p className="text-center text-xs text-gray-500 mt-4">You won't be charged yet. Provider must accept.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple placeholder icon if needed internally
function ImageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

export default ServiceDetails;
