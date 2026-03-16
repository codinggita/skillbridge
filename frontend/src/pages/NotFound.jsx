import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                <FileQuestion className="w-12 h-12 text-indigo-500" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                Sorry, we couldn't find the page you're looking for. It might have been moved or removed.
            </p>
            <Link to="/" className="btn-primary">
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
