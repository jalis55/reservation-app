import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

// Create the context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decode JWT token
  const decodeToken = (token) => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return {
        id: decoded.user_id,
        email: decoded.email,
        isAdmin: decoded.is_admin || false,
        expiresAt: decoded.exp * 1000 // Convert to milliseconds
      };
    } catch (error) {
      console.error('Failed to decode token:', error);
      setError('Invalid authentication token');
      return null;
    }
  };

  // Verify token validity
  const verifyToken = (token) => {
    if (!token) return false;
    const userData = decodeToken(token);
    return userData && userData.expiresAt > Date.now();
  };

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (verifyToken(accessToken)) {
        setUser(decodeToken(accessToken));
      } else if (refreshToken) {
        await refreshAccessToken(refreshToken);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);
      setError('Failed to initialize authentication');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh access token
  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await api.post('/api/token/refresh/', {
        refresh: refreshToken
      });
      const newAccessToken = response.data.access;
      sessionStorage.setItem('accessToken', newAccessToken);
      const userData = decodeToken(newAccessToken);
      setUser(userData);
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Don't call logout here as it would require navigate
      setUser(null);
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Token refresh failed');
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/token/', {
        email: credentials.email,
        password: credentials.password
      });

      const { access, refresh } = response.data;
      const userData = decodeToken(access);

      if (!userData) {
        throw new Error('Invalid token received');
      }

      sessionStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setUser(userData);

      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.detail || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function (now returns the state changes but doesn't navigate)
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Navigation will be handled by the component calling logout
  }, []);

  // Check authentication status
  const isAuthenticated = () => {
    return user !== null;
  };

  // Check admin status
  const isAdmin = () => {
    return user?.isAdmin || false;
  };

  // Effect to initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Value provided to context consumers
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};