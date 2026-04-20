import { get, put, del } from './api';

export const getUser = async (userId) => {
  try {
    const response = await get(`/users/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await put(`/users/${userId}`, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await del(`/users/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await get('/users/profile');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await put('/users/profile', profileData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await put('/users/change-password', passwordData);
    return response;
  } catch (error) {
    throw error;
  }
};
