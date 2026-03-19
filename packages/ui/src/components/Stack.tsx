/**
 * Stack Component — 8Hats Lab Design System
 *
 * Flex container with gap for consistent vertical/horizontal layouts.
 * Token source: spacing.md
 */

import React from 'react';

type ElementType = 'div' | 'section' | 'article' | 'aside' | 'main' | 'nav' | 'header' | 'footer' | 'ul' | 'ol' | 'span';

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  direction?: 'horizontal' | 'vertical';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 12;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  as?: ElementType;
  wrap?: boolean;
  children: React.ReactNode;
}

const gapClasses: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  7: 'gap-7',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
};

const alignClasses: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyClasses: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const Stack = React.forwardRef<HTMLElement, StackProps>(
  (
    {
      direction = 'vertical',
      gap = 4,
      align,
      justify,
      as: Component = 'div',
      wrap = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref as React.RefObject<never>}
        className={[
          'flex',
          direction === 'vertical' ? 'flex-col' : 'flex-row',
          gapClasses[gap] || 'gap-4',
          align ? alignClasses[align] : '',
          justify ? justifyClasses[justify] : '',
          wrap ? 'flex-wrap' : '',
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

Stack.displayName = 'Stack';
