/**
 * Spinner Component — 8Hats Lab Design System
 *
 * Animated loading indicator using SVG circle with stroke animation.
 * Sizes: sm (16px), md (24px), lg (40px)
 * Colors: primary (teal), secondary, current (inherits text color)
 * Token source: style1-teal-gold.json
 */

import React from 'react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'current';
}

const sizeConfig: Record<string, { dimension: number; strokeWidth: number }> = {
  sm: { dimension: 16, strokeWidth: 2 },
  md: { dimension: 24, strokeWidth: 2.5 },
  lg: { dimension: 40, strokeWidth: 3 },
};

const colorClasses: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  current: 'text-current',
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', color = 'primary', className = '', ...props }, ref) => {
    const config = sizeConfig[size];
    const radius = (config.dimension - config.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={[
          'inline-flex items-center justify-center',
          colorClasses[color],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <svg
          className="animate-spin"
          width={config.dimension}
          height={config.dimension}
          viewBox={`0 0 ${config.dimension} ${config.dimension}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background track */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="opacity-20"
          />
          {/* Animated arc */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
          />
        </svg>
        <span className="sr-only">Loading</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
