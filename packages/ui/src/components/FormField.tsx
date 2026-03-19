/**
 * FormField Component — 8Hats Lab Design System
 *
 * Wrapper for form inputs providing consistent label, error, and helper text layout.
 * Spacing: label-to-input 8px (mb-2), field-to-field 20px (space-y-5 on parent).
 * Token source: spacing.md
 */

import React from 'react';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, helperText, required, htmlFor, children, className = '', id, ...props }, ref) => {
    const fieldId = htmlFor || id || `field-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div
        ref={ref}
        className={['w-full', className].filter(Boolean).join(' ')}
        role="group"
        aria-labelledby={label ? `${fieldId}-label` : undefined}
        {...props}
      >
        {label && (
          <label
            id={`${fieldId}-label`}
            htmlFor={fieldId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
            {required && (
              <span className="text-error ml-0.5" aria-hidden="true">
                *
              </span>
            )}
            {required && (
              <span className="sr-only"> (required)</span>
            )}
          </label>
        )}

        {children}

        {error && (
          <p
            id={`${fieldId}-error`}
            className="mt-2 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${fieldId}-helper`}
            className="mt-2 text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
