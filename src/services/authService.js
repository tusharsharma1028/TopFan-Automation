import { post, get } from './api';

export const login = async (credentials) => {
  try {
    const response = await post('/auth/login', credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await post('/auth/register', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await post('/auth/logout');
    return response;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await post('/auth/refresh', { refreshToken });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await get('/auth/me');
    return response;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await post('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await post('/auth/reset-password', { token, newPassword });
    return response;
  } catch (error) {
    throw error;
  }
};
