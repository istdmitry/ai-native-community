/**
 * Tag Component — 8Hats Lab Design System
 *
 * Interactive/removable tag for categorization, filters, selections.
 * Compact inline element with optional remove action.
 */

import React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'filled';
  color?: 'primary' | 'secondary' | 'neutral';
  removable?: boolean;
  onRemove?: () => void;
  selected?: boolean;
  interactive?: boolean;
}

const variantColorClasses: Record<string, Record<string, string>> = {
  default: {
    primary: 'bg-primary-lighter text-primary',
    secondary: 'bg-secondary-light text-secondary-hover',
    neutral: 'bg-background-alt text-foreground-secondary',
  },
  outline: {
    primary: 'border border-primary/30 text-primary',
    secondary: 'border border-secondary/30 text-secondary',
    neutral: 'border border-border-light text-muted-foreground',
  },
  filled: {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    neutral: 'bg-foreground text-surface',
  },
};

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant = 'default',
      color = 'neutral',
      removable = false,
      onRemove,
      selected = false,
      interactive = false,
      className = '',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const colorClass = variantColorClasses[variant]?.[color] || variantColorClasses.default.neutral;

    const selectedClass = selected
      ? 'ring-2 ring-primary ring-offset-1'
      : '';

    const interactiveClass = interactive || onClick
      ? 'cursor-pointer hover:opacity-80 active:opacity-70 transition-opacity duration-fast'
      : '';

    return (
      <span
        ref={ref}
        className={[
          'inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap',
          colorClass,
          selectedClass,
          interactiveClass,
          className,
        ].filter(Boolean).join(' ')}
        onClick={onClick}
        role={interactive || onClick ? 'button' : undefined}
        tabIndex={interactive || onClick ? 0 : undefined}
        {...props}
      >
        {children}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-0.5 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-black/10 transition-colors duration-fast"
            aria-label="Remove"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';
