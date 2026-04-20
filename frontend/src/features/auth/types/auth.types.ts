export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUserId: string | null;
  loginTimestamp: string | null;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
