import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import authService from '../services/authService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (from cookie)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (cookies.user) {
          setCurrentUser(cookies.user);
        }
      } catch (err) {
        console.error('Authentication initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [cookies.user]);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await authService.login(username, password);
      
      if (user) {
        // Store user in cookie (7 days expiration)
        setCookie('user', user, { path: '/', maxAge: 7 * 24 * 60 * 60 });
        setCurrentUser(user);
        return user;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    removeCookie('user', { path: '/' });
    setCurrentUser(null);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return currentUser && currentUser.type === role;
  };

  // Value object that will be passed to consumers
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;