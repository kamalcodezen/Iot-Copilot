'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitBoard, X, User, Settings, LogOut, Signal } from 'lucide-react';
import { User as UserType } from '@/types';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';
import { NavLink } from './nav-links';
import { stopLenis, startLenis } from '@/lib/lenis';

interface MobileSidebarProps {
  open: boolean;
  isAuthenticated: boolean;
  user: UserType | null;
  isLoggingOut: boolean;
  onClose: () => void;
  onLogout: () => void;
  links: NavLink[];
}

export default function MobileSidebar({ open, isAuthenticated, user, isLoggingOut, onClose, onLogout, links }: MobileSidebarProps) {
  const pathname = usePathname();

  // Lock page scroll and close the drawer when pressing Escape.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stopLenis();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      startLenis();
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const linkClasses = (active: boolean) =>
    cn(
      'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent',
      active ? 'text-accent' : 'text-text-secondary hover:text-white'
    );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sidebar-backdrop absolute inset-0 backdrop-blur-sm bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '100%', borderTopLeftRadius: 100, borderBottomLeftRadius: 100 }}
            animate={{ x: 0, borderTopLeftRadius: 24, borderBottomLeftRadius: 24 }}
            exit={{ x: '100%', borderTopLeftRadius: 100, borderBottomLeftRadius: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-[300px] max-w-[85vw] bg-teal-950/90 backdrop-blur-3xl border-l border-teal-500/20 shadow-[-10px_0_40px_rgba(0,0,0,0.5)]"
            aria-label="Mobile navigation"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between h-20 border-b border-white/5 px-6 shrink-0">
                <Link href="/" className="flex items-center gap-3" onClick={onClose}>
                  <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-accent/20 border border-accent/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                    <CircuitBoard className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-xl font-extrabold"><span className="text-text-primary">IoT</span><span className="text-accent drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">Copilot</span></span>
                </Link>
                <button onClick={onClose} className="flex items-center justify-center h-10 w-10 rounded-full text-text-tertiary hover:text-white hover:bg-white/10 transition-colors" aria-label="Close menu">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-2">
                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 px-4 py-4 mb-4 rounded-3xl bg-white/5 border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]">
                    <Avatar name={user.name || 'User'} size="md" status="online" className="shadow-[0_0_10px_rgba(20,184,166,0.3)]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-text-tertiary truncate font-medium">{user.email || ''}</p>
                    </div>
                    <Signal size={16} className="text-accent shrink-0 animate-pulse" />
                  </div>
                )}

                {links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={linkClasses(active)}
                      aria-current={active ? 'page' : undefined}
                    >
                      {link.icon && <link.icon size={18} className="shrink-0 text-text-tertiary" />}
                      <span className="tracking-wide">{link.label}</span>
                    </Link>
                  );
                })}

                {isAuthenticated && (
                  <>
                    <div className="border-t border-white/5 my-4" />
                    <Link href="/profile/me" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300">
                      <User size={18} className="shrink-0 text-text-tertiary" /> My Profile
                    </Link>
                    <Link href="/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300">
                      <Settings size={18} className="shrink-0 text-text-tertiary" /> Account Settings
                    </Link>
                  </>
                )}
              </div>

              <div className="shrink-0 border-t border-white/5 p-5 bg-white/5">
                {isAuthenticated ? (
                  <button onClick={onLogout} disabled={isLoggingOut} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full">
                    <LogOut size={18} />
                    {isLoggingOut ? 'Signing out...' : 'Logout'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth/login" onClick={onClose} className="block w-full px-5 py-3 text-sm font-bold rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all text-center">Login</Link>
                    <Link href="/auth/register" onClick={onClose} className="block w-full px-5 py-3 text-sm font-bold rounded-2xl bg-gradient-to-r from-accent to-teal-400 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all text-center">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
