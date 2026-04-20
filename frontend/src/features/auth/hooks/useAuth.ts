import { useAuthContext } from '../context/AuthContext';
import { SignupCredentials, LoginCredentials, AuthResponse } from '../types/auth.types';
import { User } from '../types/auth.types';

interface UseAuthReturn {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signup: (credentials: SignupCredentials) => Promise<AuthResponse>;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { user, loading, error, signup, login, logout, isAuthenticated } = useAuthContext();

  return {
    user,
    isAuthenticated,
    loading,
    error,
    signup,
    login,
    logout,
  };
};
