import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Loader from '../../components/common/Loader/Loader';
import { validateEmail, validateRequired, validatePassword, validateMatch, getPasswordStrength } from '../../utils/validators';
import { getUserByEmail } from '../../utils/storage';
import { ROUTES } from '../../routes/RouteConfig';
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(getPasswordStrength(formData.password));
    } else {
      setPasswordStrength('');
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!validateRequired(formData.email)) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email address';
    } else {
      const existingUser = getUserByEmail(formData.email);
      if (existingUser) {
        errors.email = 'Email already registered';
      }
    }

    if (!validateRequired(formData.password)) {
      errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!validateRequired(formData.confirmPassword)) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (!validateMatch(formData.password, formData.confirmPassword)) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(register({
        email: formData.email,
        password: formData.password,
      })).unwrap();
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const getStrengthBarClass = (index) => {
    const strengthLevels = { weak: 1, medium: 2, strong: 3 };
    const currentLevel = strengthLevels[passwordStrength] || 0;
    
    if (index < currentLevel) {
      return `${styles.strengthBar} ${styles.active} ${styles[passwordStrength]}`;
    }
    return styles.strengthBar;
  };

  return (
    <div className={styles.register}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Sign up to get started</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              disabled={loading}
              placeholder="Enter your email"
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? 'email-error' : undefined}
            />
            {formErrors.email && (
              <span id="email-error" className={styles.errorText}>
                {formErrors.email}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                disabled={loading}
                placeholder="Create a password"
                autoComplete="new-password"
                aria-required="true"
                aria-invalid={!!formErrors.password}
                aria-describedby="password-requirements password-error"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex="-1"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {formData.password && (
              <div className={styles.passwordStrength}>
                <div className={getStrengthBarClass(0)}></div>
                <div className={getStrengthBarClass(1)}></div>
                <div className={getStrengthBarClass(2)}></div>
              </div>
            )}
            {passwordStrength && (
              <div className={`${styles.strengthText} ${styles[passwordStrength]}`}>
                Password strength: {passwordStrength}
              </div>
            )}
            <div id="password-requirements" className={styles.requirements}>
              Password must contain:
              <ul>
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
              </ul>
            </div>
            {formErrors.password && (
              <span id="password-error" className={styles.errorText}>
                {formErrors.password}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <div className={styles.passwordWrapper}>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formErrors.confirmPassword}
                disabled={loading}
                placeholder="Confirm your password"
                autoComplete="new-password"
                aria-required="true"
                aria-invalid={!!formErrors.confirmPassword}
                aria-describedby={formErrors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex="-1"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <span id="confirm-password-error" className={styles.errorText}>
                {formErrors.confirmPassword}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
            className={styles.submitButton}
            aria-label="Create account"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account?
            <Link to={ROUTES.LOGIN} className={styles.link}>
              Sign in
            </Link>
          </p>
        </div>

        {loading && (
          <div className={styles.loadingOverlay}>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
