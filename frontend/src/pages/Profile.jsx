import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Settings } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                <div className="px-8 pb-8">
                    {/* Avatar */}
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        {user.profilePicture ? (
                            <img 
                                src={user.profilePicture} 
                                alt={user.name} 
                                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                {user.name.charAt(0)}
                            </div>
                        )}
                        
                        <button className="btn-secondary flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit Profile</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {user.name}
                                {user.role === 'provider' && <ShieldCheck className="w-5 h-5 text-green-500" title="Verified Provider" />}
                            </h2>
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium capitalize">
                                {user.role} Account
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email Address
                                </h3>
                                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                            </div>
                            
                            {user.role === 'provider' && (
                                <>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                                            <User className="w-4 h-4" /> Bio
                                        </h3>
                                        <p className="text-gray-900 dark:text-white">{user.bio || 'No biography details added yet.'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {user.skills && user.skills.length > 0 ? (
                                                user.skills.map((skill, idx) => (
                                                    <span key={idx} className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1 rounded-full text-sm">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm">No skills added.</span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
