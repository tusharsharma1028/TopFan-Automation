import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials, ValidationError } from '../types/auth.types';
import { validateLoginForm } from '../utils/validation';
import { ROUTES } from '../constants/auth.constants';
import './AuthForms.css';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, credentials[field as keyof LoginCredentials]);
  };

  const validateField = (field: string, value: string) => {
    const tempCredentials = { ...credentials, [field]: value };
    const validation = validateLoginForm(tempCredentials);
    
    const fieldErrors = validation.errors.filter(err => err.field === field);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors[0].message;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (submitting) return;
    
    const validation = validateLoginForm(credentials);
    
    if (!validation.isValid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((err: ValidationError) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      setTouched({ email: true, password: true });
      return;
    }

    setSubmitting(true);
    try {
      const response = await login(credentials);
      
      if (response.success) {
        navigate(ROUTES.DASHBOARD);
      } else {
        setSubmitError(response.error || 'Login failed');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit} data-testid="login-form">
        <h2 className="auth-form-title">Welcome Back</h2>
        
        {submitError && (
          <div className="auth-error-banner" data-testid="submit-error">
            {submitError}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            className={errors.email && touched.email ? 'input-error' : ''}
            disabled={submitting}
            autoComplete="email"
            data-testid="login-email"
          />
          {errors.email && touched.email && (
            <span className="error-message" data-testid="email-error">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              className={errors.password && touched.password ? 'input-error' : ''}
              disabled={submitting}
              autoComplete="current-password"
              data-testid="login-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              data-testid="toggle-password"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && touched.password && (
            <span className="error-message" data-testid="password-error">{errors.password}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={submitting || loading}
          data-testid="login-submit"
        >
          {submitting || loading ? 'Logging in...' : 'Log In'}
        </button>

        <div className="auth-link">
          Don't have an account?{' '}
          <a href={ROUTES.SIGNUP} onClick={(e) => { e.preventDefault(); navigate(ROUTES.SIGNUP); }} data-testid="signup-link">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
