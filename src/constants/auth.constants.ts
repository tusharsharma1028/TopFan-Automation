export const AUTH_STORAGE_KEY = 'auth_state';
export const USERS_STORAGE_KEY = 'users';
export const MIN_PASSWORD_LENGTH = 8;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 20;

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  HOME: '/home',
  SETTINGS: '/settings',
  ROOT: '/'
};

export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  USERNAME_REQUIRED: 'Username is required',
  USERNAME_TOO_SHORT: `Username must be at least ${MIN_USERNAME_LENGTH} characters`,
  USERNAME_TOO_LONG: `Username must be no more than ${MAX_USERNAME_LENGTH} characters`,
  USERNAME_INVALID: 'Username can only contain letters, numbers, underscores, and hyphens',
  EMAIL_EXISTS: 'An account with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SIGNUP_FAILED: 'Signup failed. Please try again.',
  LOGIN_FAILED: 'Login failed. Please try again.',
  STORAGE_ERROR: 'Failed to access browser storage. Please check your browser settings.'
};
