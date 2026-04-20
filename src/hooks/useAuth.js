import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  login as loginAction,
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  clearError,
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const login = useCallback(
    async (credentials) => {
      try {
        const result = await dispatch(loginAction(credentials)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAction()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError: clearAuthError,
  };
};
