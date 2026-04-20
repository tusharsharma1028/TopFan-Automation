import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SignupCredentials, ValidationError } from '../types/auth.types';
import { validateSignupForm, getPasswordStrength } from '../utils/validation';
import { ROUTES } from '../constants/auth.constants';
import './AuthForms.css';

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  
  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    validateField(field, credentials[field as keyof SignupCredentials]);
  };

  const validateField = (field: string, value: string) => {
    const tempCredentials = { ...credentials, [field]: value };
    const validation = validateSignupForm(tempCredentials);
    
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
    
    const validation = validateSignupForm(credentials);
    
    if (!validation.isValid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((err: ValidationError) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      setTouched({ email: true, password: true, confirmPassword: true });
      return;
    }

    setSubmitting(true);
    try {
      const response = await signup(credentials);
      
      if (response.success) {
        navigate(ROUTES.DASHBOARD);
      } else {
        setSubmitError(response.error || 'Signup failed');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(credentials.password);

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit} data-testid="signup-form">
        <h2 className="auth-form-title">Create Account</h2>
        
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
            data-testid="signup-email"
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
              autoComplete="new-password"
              data-testid="signup-password"
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
          {credentials.password && !errors.password && (
            <div className="password-strength" data-testid="password-strength">
              <div className="password-strength-bar">
                <div 
                  className={`password-strength-fill strength-${passwordStrength.strength}`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
              <span className="password-strength-label">{passwordStrength.label}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              className={errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}
              disabled={submitting}
              autoComplete="new-password"
              data-testid="signup-confirm-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              data-testid="toggle-confirm-password"
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && touched.confirmPassword && (
            <span className="error-message" data-testid="confirm-password-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={submitting || loading}
          data-testid="signup-submit"
        >
          {submitting || loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="auth-link">
          Already have an account?{' '}
          <a href={ROUTES.LOGIN} onClick={(e) => { e.preventDefault(); navigate(ROUTES.LOGIN); }} data-testid="login-link">
            Log in
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
