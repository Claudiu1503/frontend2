import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Component for routes that require authentication and specific user type
const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && !allowedRoles.includes(currentUser.type)) {
    // Redirect to appropriate page based on user type
    switch (currentUser.type) {
      case 'EMPLOYEE':
        return <Navigate to="/employee" replace />;
      case 'MANAGER':
        return <Navigate to="/manager" replace />;
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If authenticated and has required role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;