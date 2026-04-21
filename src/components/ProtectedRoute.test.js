import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from './ProtectedRoute';
import authReducer from '../store/slices/authSlice';
import uiReducer from '../store/slices/uiSlice';

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithRouter = (component, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<TestComponent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

describe('ProtectedRoute Component', () => {
  test('redirects to login when not authenticated', () => {
    window.history.pushState({}, 'Test', '/protected');
    
    renderWithRouter(<ProtectedRoute />, {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      },
    });
    
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });

  test('renders protected content when authenticated', () => {
    window.history.pushState({}, 'Test', '/protected');
    
    renderWithRouter(<ProtectedRoute />, {
      auth: {
        user: { email: 'test@example.com', id: '123' },
        token: 'mock-token',
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    });
    
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument();
  });

  test('shows loader during authentication check', () => {
    window.history.pushState({}, 'Test', '/protected');
    
    renderWithRouter(<ProtectedRoute />, {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true,
        error: null,
      },
    });
    
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('maintains authentication state across navigation', () => {
    window.history.pushState({}, 'Test', '/protected');
    
    const { rerender } = renderWithRouter(<ProtectedRoute />, {
      auth: {
        user: { email: 'test@example.com', id: '123' },
        token: 'mock-token',
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    });
    
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    
    rerender(
      <Provider
        store={createMockStore({
          auth: {
            user: { email: 'test@example.com', id: '123' },
            token: 'mock-token',
            isAuthenticated: true,
            loading: false,
            error: null,
          },
        })}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<TestComponent />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });
});
