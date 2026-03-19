/**
 * Breadcrumb Component — 8Hats Lab Design System
 *
 * Navigation path for hierarchical page structure.
 * Token source: style1-teal-gold.json (primary, muted-foreground, foreground)
 */

import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = '/', className = '', ...props }, ref) => {
    if (items.length === 0) return null;

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={className}
        {...props}
      >
        <ol className="flex items-center flex-wrap gap-1 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <span
                    className="text-muted-foreground select-none"
                    aria-hidden="true"
                  >
                    {separator}
                  </span>
                )}

                {isLast ? (
                  <span
                    className="font-medium text-foreground"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <a
                    href={item.href}
                    onClick={item.onClick}
                    className="text-muted-foreground hover:text-primary transition-colors duration-fast"
                  >
                    {item.label}
                  </a>
                ) : item.onClick ? (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="text-muted-foreground hover:text-primary transition-colors duration-fast bg-transparent border-none cursor-pointer p-0"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="text-muted-foreground">{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
