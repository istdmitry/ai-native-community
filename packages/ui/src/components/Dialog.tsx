/**
 * Dialog Component — 8Hats Lab Design System
 *
 * Modal dialog with backdrop overlay.
 * Sizes: sm, md, lg
 * Features: focus trap, Escape to close, backdrop click to close, portal rendering
 * Token source: style1-teal-gold.json (rounded-card: 20px), elevation.md (shadow-lg, z-modal)
 * Pattern: React.FC (not forwardRef) — portal-rendered, no meaningful external ref target
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  children,
  className = '',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!dialogRef.current) return [];
    return Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  const trapFocus = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [getFocusableElements]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      trapFocus(e);
    },
    [onClose, trapFocus]
  );

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus the dialog or first focusable element
      requestAnimationFrame(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          dialogRef.current?.focus();
        }
      });

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      };
    }
  }, [open, handleKeyDown, getFocusableElements]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={[
          'relative w-full mx-4 bg-surface rounded-card shadow-lg animate-scale-in',
          'focus:outline-none',
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-0">
            <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close dialog"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

Dialog.displayName = 'Dialog';
