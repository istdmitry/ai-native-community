/**
 * Badge Component — 8Hats Lab Design System
 *
 * Variants: level, trust, status, default
 * Used for: level indicators, trust badges, status labels, tags
 */

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'level' | 'trust' | 'status' | 'outline';
  size?: 'sm' | 'md';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

const variantClasses: Record<string, Record<string, string>> = {
  default: {
    primary: 'bg-primary-light text-primary',
    secondary: 'bg-secondary-light text-secondary',
    success: 'bg-green-50 text-success',
    warning: 'bg-amber-50 text-warning',
    error: 'bg-red-50 text-error',
    info: 'bg-primary-light text-info',
  },
  level: {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
  },
  trust: {
    primary: 'bg-primary-lighter border border-primary/20 text-primary',
    secondary: 'bg-secondary-light border border-secondary/20 text-secondary',
    success: 'bg-green-50 border border-success/20 text-success',
    warning: 'bg-amber-50 border border-warning/20 text-warning',
    error: 'bg-red-50 border border-error/20 text-error',
    info: 'bg-primary-lighter border border-primary/20 text-info',
  },
  status: {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-primary text-white',
  },
  outline: {
    primary: 'border border-primary text-primary',
    secondary: 'border border-secondary text-secondary',
    success: 'border border-success text-success',
    warning: 'border border-warning text-warning',
    error: 'border border-error text-error',
    info: 'border border-info text-info',
  },
};

const sizeClasses: Record<string, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'sm', color = 'primary', className = '', children, ...props }, ref) => {
    const colorClass = variantClasses[variant]?.[color] || variantClasses.default.primary;

    return (
      <span
        ref={ref}
        className={[
          'inline-flex items-center font-medium rounded-full whitespace-nowrap',
          colorClass,
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
