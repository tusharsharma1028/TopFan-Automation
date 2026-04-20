import React from 'react';
import styles from './Input.module.css';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  label = '',
  name = '',
  id = '',
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const inputId = id || name || `input-${Date.now()}`;

  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`${styles.input} ${error ? styles.error : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
