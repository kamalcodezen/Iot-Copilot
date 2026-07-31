'use client';

import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const variants = {
  default: 'bg-glass text-text-secondary border-border-default',
  success: 'bg-success-light text-success border-success/30',
  warning: 'bg-warning-light text-warning border-warning/30',
  error: 'bg-error-light text-error border-error/30',
  info: 'bg-accent-light text-accent border-accent/30',
  accent: 'bg-accent-light text-accent border-accent/30',
};

export default function Badge({ children, variant = 'default', size = 'sm', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold tracking-wider uppercase',
        size === 'sm' ? 'text-[10px]' : 'text-xs',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn(
          'h-1.5 w-1.5 rounded-full mr-1.5',
          variant === 'success' ? 'bg-success animate-status-blink' :
          variant === 'warning' ? 'bg-warning animate-status-blink' :
          variant === 'error' ? 'bg-error animate-status-blink' :
          variant === 'info' || variant === 'accent' ? 'bg-accent animate-pulse-soft' :
          'bg-text-muted'
        )} />
      )}
      {children}
    </span>
  );
}
