import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { currentUser } from "../api/user.api";  // your api call to verify user

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await currentUser();  // call backend to verify user token/session
        setIsAuthenticated(true);  // verified
      } catch (error) {
        setIsAuthenticated(false); // verification failed
      } finally {
        setIsLoading(false);  // done checking
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Show a loading indicator or null while verifying
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect if not logged in
    return <Navigate to="/" replace />;
  }

  // If verified, render children
  return children;
};

export default PrivateRoute;
