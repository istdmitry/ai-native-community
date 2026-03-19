/**
 * Select Component — 8Hats Lab Design System
 *
 * Dropdown select with label, error states, helper text, and custom chevron.
 * Token source: style1-teal-gold.json (radius-input: 12px), spacing.md
 */

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, success, helperText, options, placeholder, className = '', id, value, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
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
            htmlFor={selectId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            className={[
              'w-full px-4 py-2.5 text-base bg-surface border rounded-input',
              'transition-all duration-normal ease-out-expo',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'appearance-none pr-10',
              !value && placeholder ? 'text-muted-foreground' : '',
              stateClasses,
              className,
            ].filter(Boolean).join(' ')}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom chevron icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className={[
                'h-5 w-5',
                hasError ? 'text-error' : 'text-muted-foreground',
              ].join(' ')}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="mt-2 text-sm text-error" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${selectId}-helper`} className="mt-2 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
