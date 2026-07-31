'use client';

import { Menu } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/utils/cn';

interface MobileNavProps {
  className?: string;
}

export default function MobileNav({ className }: MobileNavProps) {
  const { setSidebarOpen } = useUIStore();

  return (
    <div className={cn('flex lg:hidden', className)}>
      <button
        onClick={() => setSidebarOpen(true)}
        className="flex items-center justify-center h-9 w-9 rounded-xl bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong transition-all duration-200 touch-target"
        aria-label="Open sidebar menu"
      >
        <Menu size={18} />
      </button>
    </div>
  );
}
