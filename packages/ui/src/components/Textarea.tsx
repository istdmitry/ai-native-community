/**
 * Textarea Component — 8Hats Lab Design System
 *
 * Multiline text input with label, error/success states, helper text, char count.
 * Token source: style1-teal-gold.json (radius-input: 12px), spacing.md
 */

import React, { useState, useCallback, useEffect } from 'react';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  maxLength?: number;
  rows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, success, helperText, maxLength, rows = 4, className = '', id, value, defaultValue, onChange, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    const [charCount, setCharCount] = useState(() => {
      const initial = value ?? defaultValue ?? '';
      return String(initial).length;
    });

    // Sync charCount when controlled value changes externally
    useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length);
      }
    }, [value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length);
        onChange?.(e);
      },
      [onChange]
    );

    const stateClasses = hasError
      ? 'border-error focus:border-error focus:ring-error/20'
      : hasSuccess
      ? 'border-success focus:border-success focus:ring-success/20'
      : 'border-input focus:border-border-focus focus:ring-primary/20';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            className={[
              'w-full px-4 py-2.5 text-base bg-surface border rounded-input',
              'transition-all duration-normal ease-out-expo',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'placeholder:text-muted-foreground',
              'resize-y',
              stateClasses,
              className,
            ].join(' ')}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
            }
            {...props}
          />

          {hasError && (
            <div className="absolute top-2.5 right-0 flex items-start pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex-1">
            {error && (
              <p id={`${textareaId}-error`} className="text-sm text-error" role="alert">
                {error}
              </p>
            )}

            {!error && helperText && (
              <p id={`${textareaId}-helper`} className="text-sm text-muted-foreground">
                {helperText}
              </p>
            )}
          </div>

          {maxLength != null && (
            <span
              className={[
                'text-xs ml-2 shrink-0',
                charCount >= maxLength ? 'text-error' : 'text-muted-foreground',
              ].join(' ')}
              aria-live="polite"
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
