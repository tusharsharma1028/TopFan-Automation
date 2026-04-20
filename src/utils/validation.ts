import {
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  ERROR_MESSAGES
} from '../constants/auth.constants';
import type {
  LoginCredentials,
  SignupCredentials,
  FormValidationResult
} from '../types/auth.types';

export const validateEmail = (email: string): string | null => {
  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return ERROR_MESSAGES.EMAIL_REQUIRED;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return ERROR_MESSAGES.EMAIL_INVALID;
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return ERROR_MESSAGES.PASSWORD_REQUIRED;
  }
  
  if (password.length < MIN_PASSWORD_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }
  
  return null;
};

export const validateUsername = (username: string): string | null => {
  const trimmedUsername = username.trim();
  
  if (!trimmedUsername) {
    return ERROR_MESSAGES.USERNAME_REQUIRED;
  }
  
  if (trimmedUsername.length < MIN_USERNAME_LENGTH) {
    return ERROR_MESSAGES.USERNAME_TOO_SHORT;
  }
  
  if (trimmedUsername.length > MAX_USERNAME_LENGTH) {
    return ERROR_MESSAGES.USERNAME_TOO_LONG;
  }
  
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(trimmedUsername)) {
    return ERROR_MESSAGES.USERNAME_INVALID;
  }
  
  return null;
};

export const validateLoginForm = (credentials: LoginCredentials): FormValidationResult => {
  const errors: Record<string, string> = {};
  
  const emailError = validateEmail(credentials.email);
  if (emailError) {
    errors.email = emailError;
  }
  
  const passwordError = validatePassword(credentials.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSignupForm = (credentials: SignupCredentials): FormValidationResult => {
  const errors: Record<string, string> = {};
  
  const usernameError = validateUsername(credentials.username);
  if (usernameError) {
    errors.username = usernameError;
  }
  
  const emailError = validateEmail(credentials.email);
  if (emailError) {
    errors.email = emailError;
  }
  
  const passwordError = validatePassword(credentials.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"']/g, '');
};
