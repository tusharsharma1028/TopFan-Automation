import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import Toast from './Toast';
import uiReducer, { addNotification } from '../../../store/slices/uiSlice';
import { NOTIFICATION_TYPES } from '../../../utils/constants';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      ui: uiReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithStore = (component, initialState = {}) => {
  const store = createMockStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders notifications from Redux store', () => {
    const initialState = {
      ui: {
        notifications: [
          { id: 1, type: NOTIFICATION_TYPES.SUCCESS, message: 'Success message' },
          { id: 2, type: NOTIFICATION_TYPES.ERROR, message: 'Error message' },
        ],
        sidebarOpen: true,
        theme: 'light',
        loading: false,
        modal: { isOpen: false, type: null, data: null },
      },
    };

    renderWithStore(<Toast />, initialState);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('applies correct styling based on notification type', () => {
    const initialState = {
      ui: {
        notifications: [
          { id: 1, type: NOTIFICATION_TYPES.SUCCESS, message: 'Success' },
          { id: 2, type: NOTIFICATION_TYPES.ERROR, message: 'Error' },
          { id: 3, type: NOTIFICATION_TYPES.WARNING, message: 'Warning' },
          { id: 4, type: NOTIFICATION_TYPES.INFO, message: 'Info' },
        ],
        sidebarOpen: true,
        theme: 'light',
        loading: false,
        modal: { isOpen: false, type: null, data: null },
      },
    };

    const { container } = renderWithStore(<Toast />, initialState);

    const successToast = screen.getByText('Success').closest('div');
    const errorToast = screen.getByText('Error').closest('div');
    const warningToast = screen.getByText('Warning').closest('div');
    const infoToast = screen.getByText('Info').closest('div');

    expect(successToast).toHaveClass('success');
    expect(errorToast).toHaveClass('error');
    expect(warningToast).toHaveClass('warning');
    expect(infoToast).toHaveClass('info');
  });

  test('auto-dismisses after 3 seconds', async () => {
    const initialState = {
      ui: {
        notifications: [{ id: 1, type: NOTIFICATION_TYPES.SUCCESS, message: 'Auto dismiss' }],
        sidebarOpen: true,
        theme: 'light',
        loading: false,
        modal: { isOpen: false, type: null, data: null },
      },
    };

    renderWithStore(<Toast />, initialState);

    expect(screen.getByText('Auto dismiss')).toBeInTheDocument();

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
    });
  });

  test('allows manual dismissal via close button', async () => {
    const initialState = {
      ui: {
        notifications: [{ id: 1, type: NOTIFICATION_TYPES.SUCCESS, message: 'Manual dismiss' }],
        sidebarOpen: true,
        theme: 'light',
        loading: false,
        modal: { isOpen: false, type: null, data: null },
      },
    };

    renderWithStore(<Toast />, initialState);

    expect(screen.getByText('Manual dismiss')).toBeInTheDocument();

    const closeButton = screen.getByLabelText(/close notification/i);
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Manual dismiss')).not.toBeInTheDocument();
    });
  });

  test('handles multiple notifications stacked vertically', () => {
    const initialState = {
      ui: {
        notifications: [
          { id: 1, type: NOTIFICATION_TYPES.SUCCESS, message: 'First notification' },
          { id: 2, type: NOTIFICATION_TYPES.INFO, message: 'Second notification' },
          { id: 3, type: NOTIFICATION_TYPES.WARNING, message: 'Third notification' },
        ],
        sidebarOpen: true,
        theme: 'light',
        loading: false,
        modal: { isOpen: false, type: null, data: null },
      },
    };

    renderWithStore(<Toast />, initialState);

    expect(screen.getByText('First notification')).toBeInTheDocument();
    expect(screen.getByText('Second notification')).toBeInTheDocument();
    expect(screen.getByText('Third notification')).toBeInTheDocument();
  });

  test('renders nothing when no notifications', () => {
    const initialState = {
      ui: {
        notifications: [],
        sidebarOpen: true,
        theme: 'light',
        loading: false,
        modal: { isOpen: false, type: null, data: null },
      },
    };

    const { container } = renderWithStore(<Toast />, initialState);
    expect(container.firstChild).toBeNull();
  });
});
