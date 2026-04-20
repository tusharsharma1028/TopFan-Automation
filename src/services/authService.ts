import { v4 as uuidv4 } from 'uuid';
import {
  AUTH_STORAGE_KEY,
  USERS_STORAGE_KEY,
  ERROR_MESSAGES
} from '../constants/auth.constants';
import type {
  User,
  LoginCredentials,
  SignupCredentials,
  AuthState
} from '../types/auth.types';

const getUsers = (): User[] => {
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
};

const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
    throw new Error(ERROR_MESSAGES.STORAGE_ERROR);
  }
};

const getAuthState = (): AuthState | null => {
  try {
    const authStateJson = localStorage.getItem(AUTH_STORAGE_KEY);
    return authStateJson ? JSON.parse(authStateJson) : null;
  } catch (error) {
    console.error('Error reading auth state from localStorage:', error);
    return null;
  }
};

const saveAuthState = (authState: AuthState): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  } catch (error) {
    console.error('Error saving auth state to localStorage:', error);
    throw new Error(ERROR_MESSAGES.STORAGE_ERROR);
  }
};

const clearAuthState = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing auth state from localStorage:', error);
  }
};

export const checkEmailExists = (email: string): boolean => {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  return users.some(user => user.email.toLowerCase() === normalizedEmail);
};

export const signupUser = async (credentials: SignupCredentials): Promise<User> => {
  const normalizedEmail = credentials.email.toLowerCase().trim();
  const trimmedUsername = credentials.username.trim();
  
  if (checkEmailExists(normalizedEmail)) {
    throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
  }
  
  const users = getUsers();
  
  const newUser: User = {
    id: uuidv4(),
    username: trimmedUsername,
    email: normalizedEmail,
    password: credentials.password,
    createdAt: Date.now()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  const authState: AuthState = {
    isAuthenticated: true,
    userId: newUser.id,
    timestamp: Date.now()
  };
  saveAuthState(authState);
  
  return newUser;
};

export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  const users = getUsers();
  const normalizedEmail = credentials.email.toLowerCase().trim();
  
  const user = users.find(
    u => u.email.toLowerCase() === normalizedEmail && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }
  
  const authState: AuthState = {
    isAuthenticated: true,
    userId: user.id,
    timestamp: Date.now()
  };
  saveAuthState(authState);
  
  return user;
};

export const logoutUser = (): void => {
  clearAuthState();
};

export const getCurrentUser = (): User | null => {
  const authState = getAuthState();
  
  if (!authState || !authState.isAuthenticated || !authState.userId) {
    return null;
  }
  
  const users = getUsers();
  const user = users.find(u => u.id === authState.userId);
  
  return user || null;
};

export const isUserAuthenticated = (): boolean => {
  const authState = getAuthState();
  return authState ? authState.isAuthenticated : false;
};
