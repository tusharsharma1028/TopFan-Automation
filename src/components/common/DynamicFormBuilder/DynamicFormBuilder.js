import React, { useState } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { validateRequired, validateEmail, validateMaxDate } from '../../../utils/validators';
import styles from './DynamicFormBuilder.module.css';

const DynamicFormBuilder = ({ formConfig, onSubmit, loading = false, className = '' }) => {
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});

  if (!formConfig || !formConfig.fields || !Array.isArray(formConfig.fields)) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateField = (field, value) => {
    if (!field.validation) return '';

    if (field.validation.required && !validateRequired(value)) {
      return `${field.label} is required`;
    }

    if (field.validation.email && value && !validateEmail(value)) {
      return 'Invalid email address';
    }

    if (field.validation.maxDate && value && !validateMaxDate(value, field.validation.maxDate)) {
      return 'Date cannot be in the future';
    }

    return '';
  };

  const validateForm = () => {
    const errors = {};

    formConfig.fields.forEach((field) => {
      if (!field.name || !field.type) return;
      const value = formValues[field.name] || '';
      const error = validateField(field, value);
      if (error) {
        errors[field.name] = error;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      onSubmit(formValues);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'textarea') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderField = (field) => {
    if (!field.name || !field.type) {
      console.warn('Field missing required properties:', field);
      return null;
    }

    const fieldValue = formValues[field.name] || '';
    const fieldError = formErrors[field.name];

    return (
      <div key={field.name} className={`${styles.fieldGroup} ${className}`}>
        <label htmlFor={field.name} className={styles.label}>
          {field.label}
          {field.required && ' *'}
        </label>
        <Input
          id={field.name}
          name={field.name}
          type={field.type}
          value={fieldValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          error={fieldError}
          disabled={loading}
          placeholder={field.placeholder || ''}
          aria-required={field.required || false}
          aria-invalid={!!fieldError}
          aria-describedby={fieldError ? `${field.name}-error` : undefined}
        />
        {fieldError && (
          <span id={`${field.name}-error`} className={styles.errorText}>
            {fieldError}
          </span>
        )}
      </div>
    );
  };

  return (
    <form className={styles.formBuilder} onSubmit={handleSubmit} noValidate>
      {formConfig.fields.map((field) => renderField(field))}
      <div className={styles.submitButton}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={loading}
          aria-label={formConfig.submitLabel || 'Submit'}
        >
          {loading ? 'Submitting...' : formConfig.submitLabel || 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default DynamicFormBuilder;
