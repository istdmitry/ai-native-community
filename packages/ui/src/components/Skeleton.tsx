/**
 * Skeleton Component — 8Hats Lab Design System
 *
 * Loading placeholder with pulsing animation.
 * Supports arbitrary dimensions, rounded variant, and custom className for shape control.
 * Token source: style1-teal-gold.json
 *
 * Usage examples:
 *   <Skeleton width={200} height={16} />              — text line
 *   <Skeleton width={48} height={48} rounded />        — avatar circle
 *   <Skeleton height={120} className="rounded-card" /> — card placeholder
 */

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, rounded = false, className = '', style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={[
          'animate-pulse bg-muted-foreground/10',
          rounded ? 'rounded-full' : 'rounded-md',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
