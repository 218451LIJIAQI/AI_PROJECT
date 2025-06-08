// src/components/AuthWrapper.js
import React, { useState, useEffect } from 'react';
import { Spinner, Container } from 'react-bootstrap';
import Login from './Login';
import Register from './Register';
import authService from './authService';

const AuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated locally
      if (authService.isAuthenticated()) {
        const userData = authService.getCurrentUser();
        if (userData) {
          setCurrentUser(userData);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }

      // If no local auth, check with server
      const response = await authService.checkAuth();
      if (response.success && response.authenticated) {
        setCurrentUser(response.user);
        setIsAuthenticated(true);
      } else {
        // Clear any stale local data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const switchToRegister = () => {
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

  // Show authentication forms if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {showLogin ? (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={switchToRegister}
          />
        ) : (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </>
    );
  }

  // Show main app if authenticated, with user context
  return React.cloneElement(children, {
    currentUser,
    onLogout: handleLogout
  });
};

export default AuthWrapper; 