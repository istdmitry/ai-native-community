/**
 * Alert Component — 8Hats Lab Design System
 *
 * Persistent inline banner for important messages.
 * Variants: info, success, warning, error
 * Features: icon per variant, optional dismiss button, left border accent
 * Token source: style1-teal-gold.json (rounded-button: 12px), spacing.md
 */

import React from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

const variantConfig: Record<
  string,
  { bg: string; border: string; iconColor: string; icon: React.ReactNode }
> = {
  info: {
    bg: 'bg-primary-light',
    border: 'border-l-primary',
    iconColor: 'text-primary',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-l-success',
    iconColor: 'text-success',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-l-warning',
    iconColor: 'text-warning',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    bg: 'bg-error/10',
    border: 'border-l-error',
    iconColor: 'text-error',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, dismissible = false, onDismiss, children, className = '', ...props }, ref) => {
    const config = variantConfig[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={[
          'relative flex gap-3 px-4 py-3 border-l-4 rounded-button',
          config.bg,
          config.border,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <span className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>{config.icon}</span>

        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold text-foreground">{title}</p>
          )}
          {children && (
            <div className={`text-sm text-foreground/80 ${title ? 'mt-1' : ''}`}>
              {children}
            </div>
          )}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 p-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Dismiss alert"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
