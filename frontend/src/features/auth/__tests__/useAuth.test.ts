import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { AuthProvider } from '../context/AuthContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(AuthProvider, null, children)
);

describe('useAuth hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle signup successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const response = await result.current.signup({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });

      expect(response.success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('test@example.com');
    });
  });

  it('should handle login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signup({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
    });

    await act(async () => {
      await result.current.logout();
    });

    await act(async () => {
      const response = await result.current.login({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(response.success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('should handle logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signup({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
    });

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it('should handle signup errors', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const response = await result.current.signup({
        email: 'invalid-email',
        password: 'Password123',
        confirmPassword: 'Password123',
      });

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle login errors', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const response = await result.current.login({
        email: 'nonexistent@example.com',
        password: 'Password123',
      });

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should persist authentication across hook instances', async () => {
    const { result: result1 } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result1.current.signup({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
    });

    const { result: result2 } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result2.current.isAuthenticated).toBe(true);
      expect(result2.current.user?.email).toBe('test@example.com');
    });
  });
});
