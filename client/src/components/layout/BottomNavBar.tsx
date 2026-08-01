'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { NavLink } from './nav-links';

interface BottomNavBarProps {
  items: NavLink[];
}

export default function BottomNavBar({ items }: BottomNavBarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav
      className="fixed bottom-4 left-4 right-4 z-40 lg:hidden bg-teal-950/80 backdrop-blur-2xl border border-teal-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.1)] rounded-full safe-area-bottom pb-1 pt-1"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-center justify-around px-2">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 min-w-0 relative',
                active ? 'text-accent' : 'text-text-tertiary hover:text-white'
              )}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-2xl bg-accent/15 border border-accent/20"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
              <div className={cn('relative z-10 transition-transform duration-300', active && '-translate-y-0.5')}>
                {item.icon && <item.icon size={20} aria-hidden="true" className={cn(active && 'drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]')} />}
              </div>
              <span className={cn(
                'text-[10px] leading-tight text-center truncate font-bold relative z-10 transition-all duration-300',
                active ? 'opacity-100 translate-y-0' : 'opacity-70 group-hover:opacity-100'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
