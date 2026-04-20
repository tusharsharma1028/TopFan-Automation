import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthContextType, User, LoginCredentials, SignupCredentials } from '../types/auth.types';
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isUserAuthenticated
} from '../services/authService';
import { ERROR_MESSAGES } from '../constants/auth.constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authenticated = isUserAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_state') {
        const authenticated = isUserAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signup = async (credentials: SignupCredentials): Promise<void> => {
    try {
      const newUser = await signupUser(credentials);
      setIsAuthenticated(true);
      setUser(newUser);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const authenticatedUser = await loginUser(credentials);
      setIsAuthenticated(true);
      setUser(authenticatedUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = (): void => {
    try {
      logoutUser();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
