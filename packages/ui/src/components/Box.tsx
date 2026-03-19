/**
 * Box Component — 8Hats Lab Design System
 *
 * Generic styled container for consistent spacing access.
 * Token source: spacing.md
 */

import React from 'react';

type ElementType = 'div' | 'section' | 'article' | 'aside' | 'main' | 'nav' | 'header' | 'footer' | 'span';

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  padding?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 12;
  as?: ElementType;
  children?: React.ReactNode;
}

const paddingClasses: Record<number, string> = {
  0: 'p-0',
  1: 'p-1',
  2: 'p-2',
  3: 'p-3',
  4: 'p-4',
  5: 'p-5',
  6: 'p-6',
  7: 'p-7',
  8: 'p-8',
  10: 'p-10',
  12: 'p-12',
};

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ padding, as: Component = 'div', className = '', children, ...props }, ref) => {
    return (
      <Component
        ref={ref as React.RefObject<never>}
        className={[
          padding !== undefined ? paddingClasses[padding] ?? '' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Box.displayName = 'Box';
