import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateSignupForm } from '../../utils/validation';
import { ROUTES, ERROR_MESSAGES } from '../../constants/auth.constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (touchedFields.username) {
      const validation = validateSignupForm({ username: e.target.value, email, password });
      setErrors(validation.errors);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (touchedFields.email) {
      const validation = validateSignupForm({ username, email: e.target.value, password });
      setErrors(validation.errors);
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (touchedFields.password) {
      const validation = validateSignupForm({ username, email, password: e.target.value });
      setErrors(validation.errors);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError('');

    const credentials = { username, email, password };
    const validation = validateSignupForm(credentials);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouchedFields({ username: true, email: true, password: true });
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(credentials);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.SIGNUP_FAILED;
      setGeneralError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {generalError && <ErrorMessage message={generalError} />}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={handleUsernameChange}
                onBlur={() => handleBlur('username')}
                disabled={isSubmitting}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your username"
              />
              {touchedFields.username && errors.username && (
                <ErrorMessage message={errors.username} className="mt-1" />
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                disabled={isSubmitting}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
              {touchedFields.email && errors.email && (
                <ErrorMessage message={errors.email} className="mt-1" />
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  disabled={isSubmitting}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <span className="text-gray-500">Hide</span>
                  ) : (
                    <span className="text-gray-500">Show</span>
                  )}
                </button>
              </div>
              {touchedFields.password && errors.password && (
                <ErrorMessage message={errors.password} className="mt-1" />
              )}
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" />
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
