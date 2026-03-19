/**
 * Input Component — 8Hats Lab Design System
 *
 * Text input with label, error/success states, helper text.
 * Token source: style1-teal-gold.json (radius-input: 12px), spacing.md
 */

import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    const stateClasses = hasError
      ? 'border-error focus:border-error focus:ring-error/20'
      : hasSuccess
      ? 'border-success focus:border-success focus:ring-success/20'
      : 'border-input focus:border-border-focus focus:ring-primary/20';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full px-4 py-2.5 text-base bg-surface border rounded-input',
              'transition-all duration-normal ease-out-expo',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'placeholder:text-muted-foreground',
              stateClasses,
              className,
            ].join(' ')}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {hasError && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {hasSuccess && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-sm text-error" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-2 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
