'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'glass' | 'surface';
  hover?: boolean;
}

const variants = {
  elevated: 'bg-bg-elevated border border-border-default shadow-elevation-low',
  glass: 'glass',
  surface: 'bg-bg-surface border border-border-default shadow-elevation-low',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-5 sm:p-6 transition-all duration-300',
          variants[variant],
          hover && 'hover:shadow-elevation-medium hover:-translate-y-0.5 cursor-default',
          className
        )}
        role="region"
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
