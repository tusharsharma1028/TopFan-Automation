import { signup, login, logout, isAuthenticated, getCurrentUser, getAllUsers } from '../services/authService';
import * as storage from '../utils/storage';
import { ERROR_MESSAGES } from '../constants/auth.constants';

jest.mock('../utils/storage');

const mockStorage = storage as jest.Mocked<typeof storage>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.getItem.mockReturnValue(null);
  });

  describe('signup', () => {
    it('should create a new user with valid credentials', () => {
      mockStorage.getItem.mockReturnValue([]);
      
      const credentials = {
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = signup(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(mockStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('should reject duplicate email addresses', () => {
      const existingUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed',
        createdAt: new Date().toISOString(),
      };
      mockStorage.getItem.mockReturnValue([existingUser]);

      const credentials = {
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = signup(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.EMAIL_EXISTS);
    });

    it('should reject invalid email format', () => {
      mockStorage.getItem.mockReturnValue([]);

      const credentials = {
        email: 'invalid-email',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = signup(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toContain('email');
    });

    it('should reject weak passwords', () => {
      mockStorage.getItem.mockReturnValue([]);

      const credentials = {
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak',
      };

      const result = signup(credentials);

      expect(result.success).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      mockStorage.getItem.mockReturnValue([]);

      const credentials = {
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password456',
      };

      const result = signup(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.PASSWORD_MISMATCH);
    });

    it('should normalize email to lowercase', () => {
      mockStorage.getItem.mockReturnValue([]);

      const credentials = {
        email: 'Test@Example.COM',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = signup(credentials);

      expect(result.success).toBe(true);
      expect(result.user?.email).toBe('test@example.com');
    });
  });

  describe('login', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed_50r3t2pk_11',
      createdAt: new Date().toISOString(),
    };

    it('should login with correct credentials', () => {
      mockStorage.getItem.mockReturnValue([mockUser]);

      const credentials = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = login(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
    });

    it('should reject incorrect password', () => {
      mockStorage.getItem.mockReturnValue([mockUser]);

      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      const result = login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    it('should reject non-existent email', () => {
      mockStorage.getItem.mockReturnValue([mockUser]);

      const credentials = {
        email: 'nonexistent@example.com',
        password: 'Password123',
      };

      const result = login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    it('should handle case-insensitive email login', () => {
      mockStorage.getItem.mockReturnValue([mockUser]);

      const credentials = {
        email: 'TEST@EXAMPLE.COM',
        password: 'Password123',
      };

      const result = login(credentials);

      expect(result.success).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear authentication state', () => {
      const result = logout();

      expect(result.success).toBe(true);
      expect(mockStorage.removeItem).toHaveBeenCalledWith('topfan_auth');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when authenticated', () => {
      mockStorage.getItem.mockReturnValue({
        isAuthenticated: true,
        currentUserId: '1',
        loginTimestamp: new Date().toISOString(),
      });

      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when not authenticated', () => {
      mockStorage.getItem.mockReturnValue(null);

      expect(isAuthenticated()).toBe(false);
    });

    it('should return false when session expired', () => {
      const expiredDate = new Date();
      expiredDate.setHours(expiredDate.getHours() - 25);

      mockStorage.getItem.mockReturnValue({
        isAuthenticated: true,
        currentUserId: '1',
        loginTimestamp: expiredDate.toISOString(),
      });

      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed',
        createdAt: new Date().toISOString(),
      };

      mockStorage.getItem.mockImplementation((key: string) => {
        if (key === 'topfan_auth') {
          return {
            isAuthenticated: true,
            currentUserId: '1',
            loginTimestamp: new Date().toISOString(),
          };
        }
        if (key === 'topfan_users') {
          return [mockUser];
        }
        return null;
      });

      const user = getCurrentUser();

      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
      expect(user).not.toHaveProperty('password');
    });

    it('should return null when not authenticated', () => {
      mockStorage.getItem.mockReturnValue(null);

      const user = getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', password: 'hash1', createdAt: new Date().toISOString() },
        { id: '2', email: 'user2@example.com', password: 'hash2', createdAt: new Date().toISOString() },
      ];

      mockStorage.getItem.mockReturnValue(mockUsers);

      const users = getAllUsers();

      expect(users).toHaveLength(2);
      expect(users[0].email).toBe('user1@example.com');
    });

    it('should return empty array when no users', () => {
      mockStorage.getItem.mockReturnValue(null);

      const users = getAllUsers();

      expect(users).toEqual([]);
    });
  });
});
