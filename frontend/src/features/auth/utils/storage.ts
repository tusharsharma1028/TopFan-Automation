import { ERROR_MESSAGES } from '../constants/auth.constants';

export enum StorageKeys {
  USERS = 'topfan_users',
  AUTH = 'topfan_auth',
}

export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export const setItem = <T>(key: string, value: T): boolean => {
  try {
    if (!isStorageAvailable()) {
      throw new Error(ERROR_MESSAGES.STORAGE_NOT_AVAILABLE);
    }
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (e: any) {
    if (e.name === 'QuotaExceededError') {
      console.error(ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED);
      throw new Error(ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED);
    }
    console.error('Storage error:', e);
    throw e;
  }
};

export const getItem = <T>(key: string): T | null => {
  try {
    if (!isStorageAvailable()) {
      return null;
    }
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (e) {
    console.error('Failed to parse storage item:', e);
    return null;
  }
};

export const removeItem = (key: string): void => {
  try {
    if (!isStorageAvailable()) {
      return;
    }
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove storage item:', e);
  }
};

export const clear = (): void => {
  try {
    if (!isStorageAvailable()) {
      return;
    }
    localStorage.clear();
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
};
