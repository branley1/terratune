import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth(); // Get user and loading state

  if (loading) {
    // Show a loading indicator while checking auth status
    // This prevents flashing the login page briefly for logged-in users
    return <div>Loading...</div>; // Or a more sophisticated spinner
  }

  // If finished loading and no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />; 
    // 'replace' prevents the login page from being added to history
  }

  // If user is authenticated, render the child route's component
  return <Outlet />;
};

export default ProtectedRoute; 