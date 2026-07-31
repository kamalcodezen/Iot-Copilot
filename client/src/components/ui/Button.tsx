'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variants = {
  primary:
    'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/15 active:shadow-md active:shadow-accent/10 border border-accent/20',
  secondary:
    'bg-bg-elevated text-text-primary hover:bg-bg-hover border border-border-default shadow-elevation-low active:shadow-none',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-glass',
  outline:
    'border border-accent/40 text-accent hover:bg-accent-light',
  danger: 'bg-error-light text-error border border-error/30 hover:bg-error/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center font-semibold rounded-xl',
          'transition-all duration-200 ease-out',
          'hover:-translate-y-0.5 active:translate-y-0',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0',
          'focus-visible:outline-2 focus-visible:outline-accent/50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
