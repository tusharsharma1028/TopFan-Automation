import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import Register from './Register';
import authReducer from '../../store/slices/authSlice';
import uiReducer from '../../store/slices/uiSlice';
import * as authService from '../../services/authService';
import * as storage from '../../utils/storage';

jest.mock('../../services/authService');
jest.mock('../../utils/storage');

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (component, initialState = {}) => {
  const store = createMockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getUserByEmail.mockReturnValue(null);
  });

  test('renders registration form with all fields', () => {
    renderWithProviders(<Register />);
    
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('validates required fields on submit', async () => {
    renderWithProviders(<Register />);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
    });
  });

  test('validates password strength requirements', async () => {
    renderWithProviders(<Register />);
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await userEvent.type(passwordInput, 'weak');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  test('displays password strength indicator', async () => {
    renderWithProviders(<Register />);
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    
    await userEvent.type(passwordInput, 'Weak1');
    await waitFor(() => {
      expect(screen.getByText(/password strength: weak/i)).toBeInTheDocument();
    });
    
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'StrongPass123!');
    await waitFor(() => {
      expect(screen.getByText(/password strength: strong/i)).toBeInTheDocument();
    });
  });

  test('validates password confirmation match', async () => {
    renderWithProviders(<Register />);
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await userEvent.type(passwordInput, 'Password123');
    await userEvent.type(confirmInput, 'DifferentPassword');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('prevents duplicate email registration', async () => {
    storage.getUserByEmail.mockReturnValue({ email: 'existing@example.com' });
    
    renderWithProviders(<Register />);
    
    const emailInput = screen.getByLabelText(/^email/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await userEvent.type(emailInput, 'existing@example.com');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    authService.register.mockResolvedValue({
      user: { email: 'newuser@example.com', id: '123' },
      token: 'mock-token',
    });
    
    renderWithProviders(<Register />);
    
    const emailInput = screen.getByLabelText(/^email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await userEvent.type(emailInput, 'newuser@example.com');
    await userEvent.type(passwordInput, 'StrongPass123');
    await userEvent.type(confirmInput, 'StrongPass123');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled();
    });
  });

  test('toggles password visibility for both fields', async () => {
    renderWithProviders(<Register />);
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const toggleButtons = screen.getAllByLabelText(/show password/i);
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('type', 'password');
    
    await userEvent.click(toggleButtons[0]);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await userEvent.click(toggleButtons[1]);
    expect(confirmInput).toHaveAttribute('type', 'text');
  });

  test('displays password requirements', () => {
    renderWithProviders(<Register />);
    
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one number/i)).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    renderWithProviders(<Register />);
    
    const emailInput = screen.getByLabelText(/^email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    expect(passwordInput).toHaveAttribute('aria-required', 'true');
    expect(confirmInput).toHaveAttribute('aria-required', 'true');
  });
});
