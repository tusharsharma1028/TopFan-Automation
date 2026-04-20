import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/auth.constants';

interface UseAuthRedirectOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const { requireAuth = false, redirectTo } = options;
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      navigate(redirectTo || ROUTES.LOGIN, {
        state: { from: location },
        replace: true
      });
    } else if (!requireAuth && isAuthenticated) {
      navigate(redirectTo || ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, isLoading, requireAuth, navigate, location, redirectTo]);

  return { isAuthenticated, isLoading };
};

export default useAuthRedirect;
