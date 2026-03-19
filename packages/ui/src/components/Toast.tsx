/**
 * Toast Component — 8Hats Lab Design System
 *
 * Transient notification with auto-dismiss.
 * Variants: success, error, warning, info
 * Features: auto-dismiss, click to dismiss, slide-up enter, fade-out exit
 * Token source: style1-teal-gold.json, elevation.md (z-toast)
 * Pattern: React.FC (not forwardRef) — portal-rendered, no meaningful external ref target
 */

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ToastProps {
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

const variantConfig: Record<
  string,
  { borderColor: string; iconColor: string; icon: React.ReactNode }
> = {
  success: {
    borderColor: 'border-l-success',
    iconColor: 'text-success',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    borderColor: 'border-l-error',
    iconColor: 'text-error',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  warning: {
    borderColor: 'border-l-warning',
    iconColor: 'text-warning',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  info: {
    borderColor: 'border-l-info',
    iconColor: 'text-info',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  duration = 4000,
  onDismiss,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const dismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 200);
  }, [onDismiss]);

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  if (!isVisible) return null;

  const config = variantConfig[variant];

  return createPortal(
    <div
      role="alert"
      aria-live="polite"
      onClick={dismiss}
      className={[
        'fixed bottom-6 right-6 z-toast max-w-sm w-full cursor-pointer',
        'bg-surface border border-border-light border-l-4 rounded-button shadow-lg',
        'flex items-start gap-3 px-4 py-3',
        'transition-all duration-normal ease-out-expo',
        config.borderColor,
        isExiting ? 'opacity-0 translate-y-2' : 'animate-slide-up',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>{config.icon}</span>
      <p className="text-sm text-foreground leading-snug">{message}</p>
    </div>,
    document.body
  );
};

Toast.displayName = 'Toast';
