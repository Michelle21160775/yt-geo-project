import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsGuest(parsedUser?.isGuest === true);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsGuest(userData?.isGuest === true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token || 'guest-token');
    };

    const logout = () => {
        setUser(null);
        setIsGuest(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const updateProfile = (userData) => {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        isGuest,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
/* eslint-enable react-refresh/only-export-components */
