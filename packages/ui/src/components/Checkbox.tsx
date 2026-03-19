/**
 * Checkbox Component — 8Hats Lab Design System
 *
 * Custom styled checkbox with label, description, indeterminate state.
 * Touch target: min 44px. Keyboard accessible.
 * Token source: style1-teal-gold.json, spacing.md
 */

import React, { useRef, useEffect, useCallback } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, success, checked = false, indeterminate = false, onChange, disabled, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const internalRef = useRef<HTMLInputElement | null>(null);
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    // Sync indeterminate property (not available as HTML attribute)
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ref]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked);
      },
      [onChange]
    );

    return (
      <div className={`w-full ${className}`}>
        <label
          htmlFor={checkboxId}
          className={[
            'relative flex items-start gap-3 min-h-[44px] py-1.5 cursor-pointer',
            'select-none',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].filter(Boolean).join(' ')}
        >
          {/* Hidden native checkbox */}
          <input
            ref={setRefs}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only peer"
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${checkboxId}-error`
                : description
                ? `${checkboxId}-description`
                : undefined
            }
            {...props}
          />

          {/* Custom checkbox visual */}
          <div
            className={[
              'flex items-center justify-center shrink-0 mt-0.5',
              'h-5 w-5 rounded border-2 transition-all duration-normal ease-out-expo',
              checked || indeterminate
                ? 'bg-primary border-primary'
                : hasError
                ? 'border-error'
                : hasSuccess
                ? 'border-success'
                : 'border-input peer-focus-visible:border-border-focus peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20 peer-focus-visible:ring-offset-1',
              !checked && !indeterminate && !hasError
                ? 'peer-hover:border-primary/60'
                : '',
            ].filter(Boolean).join(' ')}
            aria-hidden="true"
          >
            {/* Checkmark icon */}
            {checked && !indeterminate && (
              <svg
                className="h-3.5 w-3.5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            {/* Indeterminate minus icon */}
            {indeterminate && (
              <svg
                className="h-3.5 w-3.5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {/* Label and description */}
          {(label || description) && (
            <div className="flex flex-col">
              {label && (
                <span className="text-sm font-medium text-foreground leading-5">
                  {label}
                </span>
              )}
              {description && (
                <span
                  id={`${checkboxId}-description`}
                  className="text-sm text-muted-foreground leading-5 mt-0.5"
                >
                  {description}
                </span>
              )}
            </div>
          )}
        </label>

        {error && (
          <p id={`${checkboxId}-error`} className="mt-1 text-sm text-error ml-8" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
