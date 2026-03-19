/**
 * Divider Component — 8Hats Lab Design System
 *
 * Separator line with optional centered label.
 * Token source: style1-teal-gold.json (border-light)
 */

import React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', label, className = '', ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={`w-px bg-border-light self-stretch ${className}`}
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={`flex items-center w-full ${className}`}
          {...props}
        >
          <div className="flex-1 h-px bg-border-light" />
          <span className="px-3 text-sm text-muted-foreground whitespace-nowrap">
            {label}
          </span>
          <div className="flex-1 h-px bg-border-light" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={`h-px bg-border-light w-full ${className}`}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
