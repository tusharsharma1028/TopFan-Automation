import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from storage
    const storedToken = getItem('token');
    const storedUser = getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setItem('user', userData);
    setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeItem('user');
    removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
