/**
 * Pagination Component — 8Hats Lab Design System
 *
 * Page navigation with ellipsis for large ranges.
 * Token source: style1-teal-gold.json (primary, primary-foreground, primary-lighter), spacing.md
 */

import React, { useCallback, useMemo } from 'react';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const ELLIPSIS = '...' as const;

function generatePageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | typeof ELLIPSIS)[] {
  const totalSlots = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis

  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = siblingCount * 2 + 3;
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...leftRange, ELLIPSIS, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = siblingCount * 2 + 3;
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => totalPages - rightCount + 1 + i
    );
    return [1, ELLIPSIS, ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  );
  return [1, ELLIPSIS, ...middleRange, ELLIPSIS, totalPages];
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    { currentPage, totalPages, onPageChange, siblingCount = 1, className = '', ...props },
    ref
  ) => {
    const pages = useMemo(
      () => generatePageRange(currentPage, totalPages, siblingCount),
      [currentPage, totalPages, siblingCount]
    );

    const handlePrevious = useCallback(() => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    }, [currentPage, onPageChange]);

    const handleNext = useCallback(() => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    }, [currentPage, totalPages, onPageChange]);

    if (totalPages <= 1) return null;

    const buttonBase =
      'inline-flex items-center justify-center h-9 min-w-[36px] px-2 text-sm rounded-button transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={className}
        {...props}
      >
        <ul className="flex items-center gap-1">
          {/* Previous */}
          <li>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentPage <= 1}
              aria-label="Go to previous page"
              className={`${buttonBase} text-muted-foreground hover:text-foreground hover:bg-primary-lighter disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
            </button>
          </li>

          {/* Page Numbers */}
          {pages.map((page, index) => {
            if (page === ELLIPSIS) {
              return (
                <li key={`ellipsis-${index}`}>
                  <span
                    className="inline-flex items-center justify-center h-9 min-w-[36px] text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                </li>
              );
            }

            const isActive = page === currentPage;

            return (
              <li key={page}>
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    buttonBase,
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-primary-lighter',
                  ].join(' ')}
                >
                  {page}
                </button>
              </li>
            );
          })}

          {/* Next */}
          <li>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              aria-label="Go to next page"
              className={`${buttonBase} text-muted-foreground hover:text-foreground hover:bg-primary-lighter disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';
