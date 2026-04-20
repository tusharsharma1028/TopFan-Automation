export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const STORAGE_KEYS = {
  USERS: 'topfan_users',
  AUTH: 'topfan_auth',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  HOME: '/home',
  SETTINGS: '/settings',
  ROOT: '/',
} as const;

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  PASSWORD_TOO_LONG: `Password must not exceed ${PASSWORD_MAX_LENGTH} characters`,
  PASSWORD_WEAK: 'Password must contain at least one letter and one number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  EMAIL_EXISTS: 'An account with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  LOGOUT_FAILED: 'Failed to logout',
  SIGNUP_FAILED: 'Failed to create account',
  LOGIN_FAILED: 'Failed to login',
  STORAGE_NOT_AVAILABLE: 'Browser storage is not available',
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded',
  USER_NOT_FOUND: 'User not found',
} as const;

export const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: 'Account created successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const;

export const SESSION_EXPIRATION_HOURS = 24;
export const MAX_USERS = 100;
