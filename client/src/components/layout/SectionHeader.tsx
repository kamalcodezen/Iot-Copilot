import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export type SectionHeaderTone = 'accent' | 'success' | 'warning' | 'info' | 'error';

const tones: Record<SectionHeaderTone, { tile: string; icon: string }> = {
  accent: { tile: 'from-accent/20 to-blue-500/10', icon: 'text-accent' },
  success: { tile: 'from-emerald-500/20 to-teal-500/10', icon: 'text-emerald-400' },
  warning: { tile: 'from-amber-500/20 to-orange-500/10', icon: 'text-amber-400' },
  info: { tile: 'from-violet-500/20 to-purple-500/10', icon: 'text-violet-400' },
  error: { tile: 'from-error/20 to-red-500/10', icon: 'text-error' },
};

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  tone?: SectionHeaderTone;
  variant?: 'page' | 'card';
  iconSize?: number;
  iconClassName?: string;
  children?: React.ReactNode;
}

export default function SectionHeader({
  icon: Icon,
  title,
  tone = 'accent',
  variant = 'page',
  iconSize = 14,
  iconClassName,
  children,
}: SectionHeaderProps) {
  const { tile, icon: iconClass } = tones[tone];
  return (
    <div className={cn('flex items-center gap-2', variant === 'page' ? 'mb-4' : 'mb-1')}>
      <div className={cn('h-7 w-7 rounded-xl bg-gradient-to-br flex items-center justify-center', tile, variant === 'card' && 'shrink-0')}>
        <Icon size={iconSize} className={cn(iconClass, iconClassName)} {...(variant === 'card' ? { 'aria-hidden': 'true' as const } : {})} />
      </div>
      <h3
        className={cn(
          variant === 'page'
            ? 'text-sm font-bold text-text-primary uppercase tracking-wide'
            : 'text-sm sm:text-base lg:text-lg font-bold tracking-tight text-text-primary'
        )}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
