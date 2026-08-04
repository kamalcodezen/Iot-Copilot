'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LayoutDashboard, User, Settings, LogOut } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';

interface NavbarUserMenuProps {
  user: { name: string; email: string; image?: string | null };
  isLoggingOut: boolean;
  onLogout: () => void;
}

export default function NavbarUserMenu({ user, isLoggingOut, onLogout }: NavbarUserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside or pressing Escape.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-full hover:bg-white/10 border border-transparent hover:border-border-default transition-all group outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="User menu"
        aria-expanded={open}
      >
        <Avatar name={user.name || 'User'} src={user.image || ''} size="sm" status="online" className="shadow-[0_0_10px_rgba(20,184,166,0.3)]" />
        <div className="text-left min-w-0 max-w-[100px] hidden xl:block">
          <p className="text-sm font-bold text-text-primary truncate">{user.name || 'User'}</p>
        </div>
        <ChevronDown size={14} className={cn('text-text-tertiary transition-transform duration-300 shrink-0', open && 'rotate-180 text-accent')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="absolute right-0 mt-4 w-60 bg-teal-950/80 backdrop-blur-3xl border border-teal-500/20 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50"
            role="menu"
          >
            <div className="p-3 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar name={user.name || 'User'} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-text-tertiary truncate">{user.email || ''}</p>
                </div>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-white hover:bg-accent/10 rounded-2xl transition-all" role="menuitem">
                <LayoutDashboard size={16} className="text-text-tertiary" /> Dashboard
              </Link>
              <Link href="/profile/me" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-white hover:bg-accent/10 rounded-2xl transition-all" role="menuitem">
                <User size={16} className="text-text-tertiary" /> Profile
              </Link>
              <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-white hover:bg-accent/10 rounded-2xl transition-all" role="menuitem">
                <Settings size={16} className="text-text-tertiary" /> Settings
              </Link>
            </div>
            <div className="p-2 border-t border-white/5">
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                disabled={isLoggingOut}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all w-full"
                role="menuitem"
              >
                <LogOut size={16} />
                {isLoggingOut ? 'Signing out...' : 'Logout'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
