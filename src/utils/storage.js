export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
      throw new Error('Storage quota exceeded. Please clear some data.');
    }
    console.error(`Error setting item ${key} in localStorage:`, error);
    return false;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
};

export const clear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

export const hasItem = (key) => {
  return localStorage.getItem(key) !== null;
};

export const getAllKeys = () => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

export const getSize = () => {
  try {
    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  } catch (error) {
    console.error('Error calculating localStorage size:', error);
    return 0;
  }
};

/**
 * Get all users from localStorage
 * @returns {Array} Array of user objects
 */
export const getAllUsers = () => {
  try {
    const users = getItem('users');
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

/**
 * Get user by email (case-insensitive)
 * @param {string} email - User email
 * @returns {Object|null} User object or null
 */
export const getUserByEmail = (email) => {
  try {
    const users = getAllUsers();
    const normalizedEmail = email.toLowerCase();
    return users.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

/**
 * Add new user to localStorage
 * @param {Object} userData - User data object
 * @returns {Object} Created user object
 */
export const addUser = (userData) => {
  try {
    const users = getAllUsers();
    const newUser = {
      ...userData,
      email: userData.email.toLowerCase(),
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setItem('users', users);
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

/**
 * Update user in localStorage
 * @param {string} email - User email
 * @param {Object} userData - Updated user data
 * @returns {Object|null} Updated user object or null
 */
export const updateUser = (email, userData) => {
  try {
    const users = getAllUsers();
    const normalizedEmail = email.toLowerCase();
    const userIndex = users.findIndex((user) => user.email.toLowerCase() === normalizedEmail);
    
    if (userIndex === -1) {
      return null;
    }
    
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      email: users[userIndex].email,
      id: users[userIndex].id,
      createdAt: users[userIndex].createdAt,
    };
    
    setItem('users', users);
    return users[userIndex];
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};
