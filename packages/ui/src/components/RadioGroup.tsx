/**
 * RadioGroup Component
 *
 * Sophisticated single-choice selection with keyboard navigation.
 * Professional design with clear visual hierarchy for options.
 */

import React, { useState, useEffect } from 'react';

export interface RadioOption {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, options, value, onChange, label, error, className = '' }, ref) => {
    const [internalValue, setInternalValue] = useState(value);
    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : internalValue;

    useEffect(() => {
      if (isControlled) {
        setInternalValue(value);
      }
    }, [isControlled, value]);

    const handleChange = (optionId: string) => {
      if (!isControlled) {
        setInternalValue(optionId);
      }
      onChange?.(optionId);
    };

    const handleKeyDown = (e: React.KeyboardEvent, optionId: string, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleChange(optionId);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % options.length;
        const nextOption = options[nextIndex];
        if (!nextOption.disabled) {
          handleChange(nextOption.id);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + options.length) % options.length;
        const prevOption = options[prevIndex];
        if (!prevOption.disabled) {
          handleChange(prevOption.id);
        }
      }
    };

    return (
      <div ref={ref} className={`w-full ${className}`} role="radiogroup" aria-label={label}>
        {label && (
          <legend className="block text-sm font-medium text-foreground mb-3">
            {label}
          </legend>
        )}

        <div className="space-y-2">
          {options.map((option, index) => {
            const isSelected = selectedValue === option.id;
            const isDisabled = option.disabled || false;

            return (
              <label
                key={option.id}
                className={`
                  group relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/40 hover:bg-muted/30'
                  }
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onKeyDown={(e) => !isDisabled && handleKeyDown(e, option.id, index)}
                tabIndex={isDisabled ? -1 : 0}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => !isDisabled && handleChange(option.id)}
                  disabled={isDisabled}
                  className="sr-only"
                  aria-describedby={option.description ? `${option.id}-description` : undefined}
                />

                <div className="flex items-center h-5 mt-0.5">
                  <div
                    className={`
                      h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                      ${isSelected
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/40 group-hover:border-primary/60'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                </div>

                <div className="ml-4 flex-1">
                  <div className={`text-base font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {option.label}
                  </div>
                  {option.description && (
                    <p
                      id={`${option.id}-description`}
                      className="mt-1 text-sm text-muted-foreground"
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {error && (
          <p className="mt-2 text-sm text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
