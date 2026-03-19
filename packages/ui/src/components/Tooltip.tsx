/**
 * Tooltip Component — 8Hats Lab Design System
 *
 * Hover/focus information popup with arrow.
 * Positions: top, bottom, left, right
 * Features: show on hover/focus, hide on blur/mouse leave, arrow pointing to trigger, viewport collision detection
 * Token source: style1-teal-gold.json, elevation.md (z-tooltip)
 * Pattern: React.FC (not forwardRef) — wrapper component, manages internal refs for positioning
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  children: React.ReactElement;
  className?: string;
}

const positionClasses: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowClasses: Record<string, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-foreground border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-foreground border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-foreground border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-foreground border-y-transparent border-l-transparent',
};

const arrowBorderWidths: Record<string, string> = {
  top: 'border-[5px]',
  bottom: 'border-[5px]',
  left: 'border-[5px]',
  right: 'border-[5px]',
};

const VIEWPORT_PADDING = 8;

function getFlippedPosition(preferred: TooltipPosition, triggerRect: DOMRect, tooltipRect: DOMRect): TooltipPosition {
  const fits: Record<TooltipPosition, boolean> = {
    top: triggerRect.top - tooltipRect.height - VIEWPORT_PADDING > 0,
    bottom: triggerRect.bottom + tooltipRect.height + VIEWPORT_PADDING < window.innerHeight,
    left: triggerRect.left - tooltipRect.width - VIEWPORT_PADDING > 0,
    right: triggerRect.right + tooltipRect.width + VIEWPORT_PADDING < window.innerWidth,
  };

  if (fits[preferred]) return preferred;

  const opposites: Record<TooltipPosition, TooltipPosition> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  if (fits[opposites[preferred]]) return opposites[preferred];

  const fallbacks: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];
  return fallbacks.find(p => fits[p]) || preferred;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [resolvedPosition, setResolvedPosition] = useState<TooltipPosition>(position);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current || !tooltipRef.current) return;
    const triggerRect = containerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    setResolvedPosition(getFlippedPosition(position, triggerRect, tooltipRect));
  }, [isVisible, position]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={[
            'absolute z-tooltip whitespace-nowrap',
            'bg-foreground text-surface text-sm px-3 py-1.5 rounded-md',
            'animate-fade-in pointer-events-none',
            positionClasses[resolvedPosition],
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {content}
          {/* Arrow */}
          <span
            className={[
              'absolute w-0 h-0',
              arrowBorderWidths[resolvedPosition],
              arrowClasses[resolvedPosition],
            ].join(' ')}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';
