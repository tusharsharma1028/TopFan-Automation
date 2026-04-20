import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  ERROR_MESSAGES,
} from '../constants/auth.constants';
import { ValidationResult, SignupCredentials, LoginCredentials } from '../types/auth.types';

export const validateEmail = (email: string): ValidationResult => {
  const errors = [];
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.push({ field: 'email', message: ERROR_MESSAGES.EMAIL_REQUIRED });
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.push({ field: 'email', message: ERROR_MESSAGES.EMAIL_INVALID });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors = [];

  if (!password) {
    errors.push({ field: 'password', message: ERROR_MESSAGES.PASSWORD_REQUIRED });
    return { isValid: false, errors };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push({ field: 'password', message: ERROR_MESSAGES.PASSWORD_TOO_SHORT });
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    errors.push({ field: 'password', message: ERROR_MESSAGES.PASSWORD_TOO_LONG });
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    errors.push({ field: 'password', message: ERROR_MESSAGES.PASSWORD_WEAK });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignupForm = (credentials: SignupCredentials): ValidationResult => {
  const errors = [];

  const emailValidation = validateEmail(credentials.email);
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  }

  const passwordValidation = validatePassword(credentials.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  if (credentials.password !== credentials.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: ERROR_MESSAGES.PASSWORD_MISMATCH });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLoginForm = (credentials: LoginCredentials): ValidationResult => {
  const errors = [];

  const emailValidation = validateEmail(credentials.email);
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  }

  if (!credentials.password) {
    errors.push({ field: 'password', message: ERROR_MESSAGES.PASSWORD_REQUIRED });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getPasswordStrength = (password: string): { strength: number; label: string } => {
  let strength = 0;

  if (password.length >= PASSWORD_MIN_LENGTH) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return {
    strength: Math.min(strength, 5),
    label: labels[Math.min(strength, 4)] || 'Very Weak',
  };
};
