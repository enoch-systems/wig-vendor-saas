import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const authStatus = sessionStorage.getItem('isAdminAuthenticated');
    
    if (authStatus !== 'true') {
      // Auto-login with hardcoded credentials
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
