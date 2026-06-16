
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth'; 

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (!user || user.role !== 'creator') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;