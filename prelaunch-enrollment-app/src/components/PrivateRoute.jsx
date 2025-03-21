import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    console.log('PrivateRoute check:', {
        path: location.pathname,
        token: !!token,
        userRole,
        userId
    });

    if (!token) {
        // Redirect to login page but save the attempted location
        toast.error('Please log in to access this page');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Only check admin access for the admin dashboard
    if (location.pathname === '/admin' && userRole !== 'admin') {
        toast.error('Access denied: Admin privileges required');
        return <Navigate to={`/profile/${userId}`} replace />;
    }

    // Check if user is trying to access their own profile
    if (location.pathname.startsWith('/profile/')) {
        const profileId = location.pathname.split('/')[2];

        console.log('Profile access check:', {
            profileId,
            userId,
            userRole
        });

        // If user is not admin and trying to access someone else's profile
        if (userRole !== 'admin' && profileId !== userId) {
            toast.error('Access denied: You can only view your own profile');
            return <Navigate to={`/profile/${userId}`} replace />;
        }
    }

    return children;
};

export default PrivateRoute; 