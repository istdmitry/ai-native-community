/**
 * Grid Component — 8Hats Lab Design System
 *
 * Responsive CSS grid layout with auto-fit support.
 * Token source: spacing.md (gap-7 = 28px for card grids)
 */

import React from 'react';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 'auto';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 12;
  minChildWidth?: string;
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

const fixedColumnClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns = 'auto',
      gap = 7,
      minChildWidth = '280px',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isAuto = columns === 'auto';

    return (
      <div
        ref={ref}
        className={[
          'grid',
          gapClasses[gap] ?? 'gap-7',
          !isAuto ? fixedColumnClasses[columns] : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={
          isAuto
            ? {
                gridTemplateColumns: `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`,
                ...style,
              }
            : style
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';
