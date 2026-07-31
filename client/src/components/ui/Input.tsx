'use client';

import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary" aria-hidden="true">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border bg-bg-elevated px-4 py-2.5 text-sm text-text-primary',
              'placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/40',
              'transition-all duration-200',
              'shadow-elevation-low focus:shadow-elevation-medium',
              icon && 'pl-10',
              error ? 'border-error/50' : 'border-border-default',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="text-xs text-error font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
