import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);

        // Global axios interceptor for handling invalid tokens/sessions
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    logout();
                    window.location.href = '/login'; // Force redirect to login
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const signup = async (name, email, password, role) => {
        const { data } = await axios.post('/api/auth/signup', { name, email, password, role });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    // Export authorization header config helper
    const authConfig = () => {
        return {
            headers: { Authorization: `Bearer ${user?.token}` }
        };
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, authConfig }}>
            {children}
        </AuthContext.Provider>
    );
};
