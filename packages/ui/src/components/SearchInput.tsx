/**
 * SearchInput Component — 8Hats Lab Design System
 *
 * Search input with left search icon and right clear button.
 * Extends Input styling (rounded-input, focus:ring-2, etc.).
 * Token source: style1-teal-gold.json (radius-input: 12px), spacing.md
 */

import React, { useState, useCallback } from 'react';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, onClear, onChange, placeholder = 'Search...', label, className = '', id, value: controlledValue, defaultValue, ...props }, ref) => {
    const inputId = id || `search-${Math.random().toString(36).substr(2, 9)}`;
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(String(defaultValue ?? ''));
    const displayValue = isControlled ? String(controlledValue) : internalValue;
    const hasValue = displayValue.length > 0;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalValue(e.target.value);
        }
        onChange?.(e);
      },
      [isControlled, onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSearch?.(displayValue);
        }
      },
      [displayValue, onSearch]
    );

    const handleClear = useCallback(() => {
      if (!isControlled) {
        setInternalValue('');
      }
      onClear?.();
      onSearch?.('');
    }, [isControlled, onClear, onSearch]);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Search icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <input
            ref={ref}
            id={inputId}
            type="search"
            role="searchbox"
            value={displayValue}
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={[
              'w-full pl-10 pr-10 py-2.5 text-base bg-surface border border-input rounded-input',
              'transition-all duration-normal ease-out-expo',
              'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-border-focus focus:ring-primary/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'placeholder:text-muted-foreground',
              // Hide native search cancel button (cross-browser)
              '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
              className,
            ].join(' ')}
            aria-label={label || placeholder}
            {...props}
          />

          {/* Clear button */}
          {hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className={[
                'absolute inset-y-0 right-0 flex items-center pr-3',
                'text-muted-foreground hover:text-foreground',
                'transition-colors duration-fast',
                'focus-visible:outline-none focus-visible:text-foreground',
              ].join(' ')}
              aria-label="Clear search"
              tabIndex={-1}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
