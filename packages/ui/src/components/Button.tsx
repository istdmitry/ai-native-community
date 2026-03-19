/**
 * Button Component — 8Hats Lab Design System
 *
 * Variants: primary (teal), secondary (outlined), gold (accent), ghost, pill
 * Sizes: sm, md, lg
 * Token source: style1-teal-gold.json, spacing.md
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-button hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-button focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  secondary:
    'bg-transparent text-foreground border border-border-light hover:border-secondary hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  gold:
    'bg-secondary text-secondary-foreground hover:bg-secondary-hover hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2',
  ghost:
    'text-foreground hover:bg-primary-lighter active:bg-primary-light focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  pill:
    'bg-transparent text-foreground border border-border-light rounded-full hover:border-secondary hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
};

const sizeClasses: Record<string, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5 min-h-[36px]',
  md: 'text-base px-6 py-3 gap-2 min-h-[44px]',
  lg: 'text-lg px-7 py-3.5 gap-2.5 min-h-[52px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center font-semibold transition-all duration-normal ease-out-expo',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          'focus-visible:outline-none',
          variant === 'pill' ? '' : 'rounded-button',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin-slow h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
