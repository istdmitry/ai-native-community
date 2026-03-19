/**
 * Link Component — 8Hats Lab Design System
 *
 * Styled anchor with variant support and external link handling.
 * Token source: style1-teal-gold.json (primary, primary-hover, muted-foreground, foreground)
 */

import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'muted' | 'primary';
  external?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  default:
    'text-primary hover:text-primary-hover underline-offset-4 hover:underline transition-colors duration-fast',
  muted:
    'text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors duration-fast',
  primary:
    'text-primary font-medium hover:text-primary-hover underline-offset-4 hover:underline transition-colors duration-fast',
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = 'default', external = false, className = '', children, ...props }, ref) => {
    const externalProps = external
      ? { target: '_blank' as const, rel: 'noopener noreferrer' }
      : {};

    return (
      <a
        ref={ref}
        className={[
          'inline-flex items-center gap-1',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
          variantClasses[variant],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...externalProps}
        {...props}
      >
        {children}
        {external && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
            aria-hidden="true"
          >
            <path
              d="M5.25 2.625H3.0625C2.82088 2.625 2.625 2.82088 2.625 3.0625V10.9375C2.625 11.1791 2.82088 11.375 3.0625 11.375H10.9375C11.1791 11.375 11.375 11.1791 11.375 10.9375V8.75"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.75 2.625H11.375V5.25"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.5625 7.4375L11.375 2.625"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </a>
    );
  }
);

Link.displayName = 'Link';
