export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhoneNumber = (phone) => {
  // US phone number format
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value, minLength) => {
  if (typeof value !== 'string') return false;
  return value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  if (typeof value !== 'string') return false;
  return value.length <= maxLength;
};

export const validateRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

export const validateMatch = (value1, value2) => {
  return value1 === value2;
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};

export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = values[field];
    const fieldRules = rules[field];

    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = fieldRules.requiredMessage || 'This field is required';
      return;
    }

    if (fieldRules.email && value && !validateEmail(value)) {
      errors[field] = fieldRules.emailMessage || 'Invalid email address';
      return;
    }

    if (fieldRules.password && value && !validatePassword(value)) {
      errors[field] = fieldRules.passwordMessage || 'Password must be at least 8 characters with uppercase, lowercase, and number';
      return;
    }

    if (fieldRules.minLength && value && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = fieldRules.minLengthMessage || `Minimum length is ${fieldRules.minLength} characters`;
      return;
    }

    if (fieldRules.maxLength && value && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = fieldRules.maxLengthMessage || `Maximum length is ${fieldRules.maxLength} characters`;
      return;
    }

    if (fieldRules.match && value && !validateMatch(value, values[fieldRules.match])) {
      errors[field] = fieldRules.matchMessage || 'Values do not match';
      return;
    }
  });

  return errors;
};
