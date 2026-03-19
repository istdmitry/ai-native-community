/**
 * Card Component — 8Hats Lab Design System
 *
 * Variants: default, stat, signal, option, insight
 * Token source: spacing.md (32px padding), elevation.md (shadow-card), style1-teal-gold.json
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'stat' | 'signal' | 'option' | 'insight';
  recommended?: boolean;
  hoverable?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const variantClasses: Record<string, string> = {
  default: 'bg-surface p-8 rounded-card border border-border-light shadow-card',
  stat: 'bg-surface p-8 rounded-card shadow-sm',
  signal: 'bg-surface px-8 py-10 rounded-card border border-border-light shadow-sm relative overflow-hidden border-t-2 border-t-secondary',
  option: 'bg-surface px-10 py-12 rounded-card border border-border-light shadow-sm',
  insight: 'bg-primary-light border-l-4 border-l-primary p-6 rounded-r-button',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', recommended = false, hoverable = false, className = '', children, ...props }, ref) => {
    const hoverClass = hoverable
      ? 'transition-all duration-fast ease-out-expo hover:-translate-y-1 hover:shadow-md active:-translate-y-0.5'
      : '';

    const recommendedClass = recommended && variant === 'option'
      ? 'border-secondary shadow-lg ring-1 ring-secondary'
      : '';

    return (
      <div
        ref={ref}
        className={[variantClasses[variant], hoverClass, recommendedClass, className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardBody.displayName = 'CardBody';

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`mt-6 pt-4 border-t border-border-light ${className}`} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';
