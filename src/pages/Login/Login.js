import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Loader from '../../components/common/Loader/Loader';
import { validateEmail, validateRequired } from '../../utils/validators';
import { ROUTES } from '../../routes/RouteConfig';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

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
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!validateRequired(formData.email)) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!validateRequired(formData.password)) {
      errors.password = 'Password is required';
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
      await login(formData);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
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
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-required="true"
                aria-invalid={!!formErrors.password}
                aria-describedby={formErrors.password ? 'password-error' : undefined}
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
            {formErrors.password && (
              <span id="password-error" className={styles.errorText}>
                {formErrors.password}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
            className={styles.submitButton}
            aria-label="Sign in"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Don't have an account?
            <Link to={ROUTES.REGISTER} className={styles.link}>
              Sign up
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

export default Login;
