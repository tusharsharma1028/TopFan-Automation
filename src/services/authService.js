import { getItem, setItem, removeItem, getUserByEmail, addUser } from '../utils/storage';

/**
 * Generate a mock JWT token
 * @param {Object} user - User object
 * @returns {string} Mock JWT token
 */
const generateMockToken = (user) => {
  const payload = {
    email: user.email,
    id: user.id,
    timestamp: Date.now(),
  };
  return btoa(JSON.stringify(payload));
};

/**
 * Login with email and password
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} User and token
 */
export const login = async (credentials) => {
  try {
    const { email, password } = credentials;
    const normalizedEmail = email.toLowerCase();
    
    const user = getUserByEmail(normalizedEmail);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    const token = generateMockToken(user);
    const userWithoutPassword = {
      email: user.email,
      id: user.id,
      createdAt: user.createdAt,
    };
    
    setItem('token', token);
    setItem('user', userWithoutPassword);
    
    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData - { email, password }
 * @returns {Promise<Object>} User and token
 */
export const register = async (userData) => {
  try {
    const { email, password } = userData;
    const normalizedEmail = email.toLowerCase();
    
    const existingUser = getUserByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    const newUser = addUser({
      email: normalizedEmail,
      password,
    });
    
    const token = generateMockToken(newUser);
    const userWithoutPassword = {
      email: newUser.email,
      id: newUser.id,
      createdAt: newUser.createdAt,
    };
    
    setItem('token', token);
    setItem('user', userWithoutPassword);
    
    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    removeItem('token');
    removeItem('user');
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user from localStorage
 * @returns {Promise<Object>} Current user
 */
export const getCurrentUser = async () => {
  try {
    const user = getItem('user');
    if (!user) {
      throw new Error('No user found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};
