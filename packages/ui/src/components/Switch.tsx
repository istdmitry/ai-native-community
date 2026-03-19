/**
 * Switch Component — 8Hats Lab Design System
 *
 * Toggle switch with label, description, and animated knob.
 * Sizes: sm, md. Uses ease-spring for knob transition.
 * Token source: style1-teal-gold.json, spacing.md
 */

import React, { useCallback } from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md';
}

const sizeConfig = {
  sm: {
    track: 'h-5 w-9',
    knob: 'h-4 w-4',
    translateOn: 'translate-x-4',
    translateOff: 'translate-x-0',
  },
  md: {
    track: 'h-6 w-11',
    knob: 'h-5 w-5',
    translateOn: 'translate-x-5',
    translateOff: 'translate-x-0',
  },
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, error, success, checked = false, onChange, size = 'md', disabled, className = '', id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
    const config = sizeConfig[size];
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked);
      },
      [onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (!disabled) {
            onChange?.(!checked);
          }
        }
      },
      [checked, disabled, onChange]
    );

    return (
      <div className={`w-full ${className}`}>
        <label
          htmlFor={switchId}
          className={[
            'relative flex items-start gap-3 min-h-[44px] py-1.5 cursor-pointer select-none',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].filter(Boolean).join(' ')}
        >
          {/* Hidden native checkbox */}
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="sr-only peer"
            aria-checked={checked}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${switchId}-error`
                : description
                ? `${switchId}-description`
                : undefined
            }
            {...props}
          />

          {/* Track */}
          <div
            className={[
              'relative inline-flex shrink-0 rounded-full transition-colors duration-normal',
              config.track,
              checked
                ? 'bg-primary'
                : hasError
                ? 'bg-input border border-error'
                : hasSuccess
                ? 'bg-input border border-success'
                : 'bg-input border border-border',
              !disabled && !checked
                ? 'peer-hover:bg-muted-foreground/20 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20 peer-focus-visible:ring-offset-1'
                : '',
              !disabled && checked
                ? 'peer-hover:bg-primary-hover peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20 peer-focus-visible:ring-offset-1'
                : '',
            ].filter(Boolean).join(' ')}
            aria-hidden="true"
          >
            {/* Knob */}
            <span
              className={[
                'inline-block rounded-full bg-white shadow-sm',
                'transform transition-transform duration-normal ease-spring',
                config.knob,
                'mt-0.5 ml-0.5',
                checked ? config.translateOn : config.translateOff,
              ].join(' ')}
            />
          </div>

          {/* Label and description */}
          {(label || description) && (
            <div className="flex flex-col">
              {label && (
                <span className="text-sm font-medium text-foreground leading-5">
                  {label}
                </span>
              )}
              {description && (
                <span
                  id={`${switchId}-description`}
                  className="text-sm text-muted-foreground leading-5 mt-0.5"
                >
                  {description}
                </span>
              )}
            </div>
          )}
        </label>

        {error && (
          <p id={`${switchId}-error`} className="mt-1 text-sm text-error ml-14" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
