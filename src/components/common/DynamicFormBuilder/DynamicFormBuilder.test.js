import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynamicFormBuilder from './DynamicFormBuilder';

const mockFormConfig = {
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      validation: { required: true },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
      validation: { required: true, email: true },
    },
    {
      name: 'dob',
      type: 'date',
      label: 'Date of Birth',
      required: true,
      validation: { required: true, maxDate: new Date().toISOString().split('T')[0] },
    },
  ],
  submitLabel: 'Submit',
};

describe('DynamicFormBuilder Component', () => {
  test('renders empty form with no fields when formConfig is empty', () => {
    const { container } = render(<DynamicFormBuilder formConfig={{}} onSubmit={jest.fn()} />);
    expect(container.querySelector('form')).toBeNull();
  });

  test('renders empty form when formConfig is undefined', () => {
    const { container } = render(<DynamicFormBuilder onSubmit={jest.fn()} />);
    expect(container.querySelector('form')).toBeNull();
  });

  test('renders text, email, and date field types correctly', () => {
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('applies custom className to field containers', () => {
    const { container } = render(
      <DynamicFormBuilder formConfig={mockFormConfig} onSubmit={jest.fn()} className="customClass" />
    );
    const fieldGroups = container.querySelectorAll('.customClass');
    expect(fieldGroups.length).toBeGreaterThan(0);
  });

  test('handles form submission and calls onSubmit with collected data', async () => {
    const mockOnSubmit = jest.fn();
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={mockOnSubmit} />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const dobInput = screen.getByLabelText(/date of birth/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(fullNameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(dobInput, '1990-01-01');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john@example.com',
        dob: '1990-01-01',
      });
    });
  });

  test('validates required fields', async () => {
    const mockOnSubmit = jest.fn();
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates email fields using validateEmail', async () => {
    const mockOnSubmit = jest.fn();
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(emailInput, 'invalidemail');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates date fields for future dates', async () => {
    const mockOnSubmit = jest.fn();
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={mockOnSubmit} />);

    const dobInput = screen.getByLabelText(/date of birth/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    await userEvent.type(dobInput, futureDateString);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/date cannot be in the future/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('disables submit button when loading prop is true', () => {
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={jest.fn()} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /submitting/i });
    expect(submitButton).toBeDisabled();
  });

  test('handles keyboard navigation with Tab order', async () => {
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={jest.fn()} />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const dobInput = screen.getByLabelText(/date of birth/i);

    fullNameInput.focus();
    expect(document.activeElement).toBe(fullNameInput);

    await userEvent.tab();
    expect(document.activeElement).toBe(emailInput);

    await userEvent.tab();
    expect(document.activeElement).toBe(dobInput);
  });

  test('handles Enter key to submit form', async () => {
    const mockOnSubmit = jest.fn();
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={mockOnSubmit} />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const dobInput = screen.getByLabelText(/date of birth/i);

    await userEvent.type(fullNameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(dobInput, '1990-01-01');

    fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john@example.com',
        dob: '1990-01-01',
      });
    });
  });

  test('handles malformed formConfig gracefully', () => {
    const malformedConfig = {
      fields: [
        { name: 'field1' },
        { type: 'text' },
        { name: 'validField', type: 'text', label: 'Valid' },
      ],
      submitLabel: 'Submit',
    };

    render(<DynamicFormBuilder formConfig={malformedConfig} onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/valid/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('prevents XSS by treating scripts as plain text', async () => {
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={jest.fn()} />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    const xssPayload = '<script>alert("XSS")</script>';

    await userEvent.type(fullNameInput, xssPayload);

    expect(fullNameInput).toHaveValue(xssPayload);
    expect(document.querySelectorAll('script').length).toBe(0);
  });

  test('prevents duplicate submissions by disabling button', async () => {
    const mockOnSubmit = jest.fn();
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={mockOnSubmit} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /submitting/i });
    expect(submitButton).toBeDisabled();

    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('clears field errors on input change', async () => {
    render(<DynamicFormBuilder formConfig={mockFormConfig} onSubmit={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    });

    const fullNameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(fullNameInput, 'John Doe');

    await waitFor(() => {
      expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument();
    });
  });
});
