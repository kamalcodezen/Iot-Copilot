'use client';

import { cn } from '@/utils/cn';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
}

const sizes = { sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-12 w-12', xl: 'h-18 w-18' };
const textSizes = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm', xl: 'text-lg' };
const statusColors = {
  online: 'bg-success',
  away: 'bg-warning',
  busy: 'bg-error',
  offline: 'bg-text-muted',
};

export default function Avatar({ src, name, size = 'md', className, status }: AvatarProps) {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const avatar = src ? (
    <div className={cn('relative rounded-full overflow-hidden ring-2 ring-border-default', sizes[size], className)}>
      <Image src={src} alt={name} fill className="object-cover" />
    </div>
  ) : (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-accent to-deep-blue flex items-center justify-center font-bold text-white ring-2 ring-border-default',
        sizes[size],
        className
      )}
    >
      <span className={textSizes[size]}>{initials}</span>
    </div>
  );

  return (
    <div className="relative shrink-0">
      {avatar}
      {status && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-primary',
            statusColors[status]
          )}
          aria-label={status}
        />
      )}
    </div>
  );
}
