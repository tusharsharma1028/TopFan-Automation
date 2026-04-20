import React from 'react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning';
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, type = 'error', className = '' }) => {
  if (!message) return null;

  const baseClasses = 'text-sm rounded-md p-2 mt-1';
  const typeClasses = {
    error: 'text-red-600 bg-red-50 border border-red-200',
    warning: 'text-yellow-700 bg-yellow-50 border border-yellow-200'
  };

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
};

export default ErrorMessage;
