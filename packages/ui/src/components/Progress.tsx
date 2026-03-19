/**
 * Progress Component
 *
 * Minimal, informative progress indicator for assessment flow.
 * Clean visual representation of completion status.
 */

import React from 'react';

export interface ProgressProps {
  current: number;
  total: number;
  label?: string;
  showSteps?: boolean;
  className?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ current, total, label, showSteps = true, className = '' }, ref) => {
    const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
    const isComplete = current >= total;

    return (
      <div ref={ref} className={`w-full ${className}`} role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
        {/* Progress Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {label && (
              <span className="text-sm font-medium text-foreground">{label}</span>
            )}
            {showSteps && (
              <span className="text-sm text-muted-foreground">
                {current} of {total}
              </span>
            )}
          </div>

          <span className="text-sm font-medium text-primary">
            {Math.round(percentage)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              isComplete ? 'bg-success' : 'bg-primary'
            }`}
            style={{ width: `${percentage}%` }}
          >
            {/* Animated shine effect */}
            {percentage > 0 && percentage < 100 && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                style={{ backgroundSize: '200% 100%' }}
              />
            )}
          </div>
        </div>

        {/* Step Indicators (optional visual enhancement) */}
        {total <= 10 && (
          <div className="flex justify-between mt-2">
            {Array.from({ length: total }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 mx-0.5 rounded-full transition-colors duration-300 ${
                  index < current
                    ? isComplete && index === total - 1
                      ? 'bg-success'
                      : 'bg-primary'
                    : 'bg-border'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
