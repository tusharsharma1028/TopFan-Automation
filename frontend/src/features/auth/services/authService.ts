import { User, AuthState, SignupCredentials, LoginCredentials, AuthResponse } from '../types/auth.types';
import { validateSignupForm, validateLoginForm } from '../utils/validation';
import { setItem, getItem, removeItem } from '../utils/storage';
import { STORAGE_KEYS, ERROR_MESSAGES, MAX_USERS, SESSION_EXPIRATION_HOURS } from '../constants/auth.constants';
import { v4 as uuidv4 } from 'uuid';

const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `hashed_${Math.abs(hash).toString(36)}_${password.length}`;
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export const getAllUsers = (): User[] => {
  const users = getItem<User[]>(STORAGE_KEYS.USERS);
  return users || [];
};

const saveUsers = (users: User[]): void => {
  setItem(STORAGE_KEYS.USERS, users);
};

const getAuthState = (): AuthState | null => {
  return getItem<AuthState>(STORAGE_KEYS.AUTH);
};

const setAuthState = (authState: AuthState): void => {
  setItem(STORAGE_KEYS.AUTH, authState);
};

const isSessionExpired = (loginTimestamp: string | null): boolean => {
  if (!loginTimestamp) return true;
  
  const loginTime = new Date(loginTimestamp).getTime();
  const now = new Date().getTime();
  const expirationTime = SESSION_EXPIRATION_HOURS * 60 * 60 * 1000;
  
  return now - loginTime > expirationTime;
};

export const signup = (credentials: SignupCredentials): AuthResponse => {
  try {
    const validation = validateSignupForm(credentials);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors[0]?.message || ERROR_MESSAGES.SIGNUP_FAILED,
      };
    }

    const users = getAllUsers();
    
    if (users.length >= MAX_USERS) {
      return {
        success: false,
        error: ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED,
      };
    }

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
    
    if (existingUser) {
      return {
        success: false,
        error: ERROR_MESSAGES.EMAIL_EXISTS,
      };
    }

    const newUser: User = {
      id: uuidv4(),
      email: normalizedEmail,
      password: hashPassword(credentials.password),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const authState: AuthState = {
      isAuthenticated: true,
      currentUserId: newUser.id,
      loginTimestamp: new Date().toISOString(),
    };
    setAuthState(authState);

    const { password, ...userWithoutPassword } = newUser;
    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.SIGNUP_FAILED,
    };
  }
};

export const login = (credentials: LoginCredentials): AuthResponse => {
  try {
    const validation = validateLoginForm(credentials);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors[0]?.message || ERROR_MESSAGES.LOGIN_FAILED,
      };
    }

    const users = getAllUsers();
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user || !verifyPassword(credentials.password, user.password)) {
      return {
        success: false,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS,
      };
    }

    const authState: AuthState = {
      isAuthenticated: true,
      currentUserId: user.id,
      loginTimestamp: new Date().toISOString(),
    };
    setAuthState(authState);

    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.LOGIN_FAILED,
    };
  }
};

export const logout = (): AuthResponse => {
  try {
    removeItem(STORAGE_KEYS.AUTH);
    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || ERROR_MESSAGES.LOGOUT_FAILED,
    };
  }
};

export const isAuthenticated = (): boolean => {
  const authState = getAuthState();
  if (!authState || !authState.isAuthenticated || !authState.currentUserId) {
    return false;
  }
  
  if (isSessionExpired(authState.loginTimestamp)) {
    logout();
    return false;
  }
  
  return true;
};

export const getCurrentUser = (): Omit<User, 'password'> | null => {
  if (!isAuthenticated()) {
    return null;
  }

  const authState = getAuthState();
  if (!authState || !authState.currentUserId) {
    return null;
  }

  const users = getAllUsers();
  const user = users.find(u => u.id === authState.currentUserId);

  if (!user) {
    return null;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
