'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Bot, Route, FolderKanban, Compass, Bug, Briefcase,
  Users, User, Settings, Shield, ChevronLeft, ChevronRight, CircuitBoard, X, LogOut, Home, Signal,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/store/uiStore';
import { authClient } from '@/lib/auth-client';
import { SessionUser } from '@/lib/session';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ai-mentor', label: 'AI Mentor', icon: Bot },
  { href: '/learning-path', label: 'Learning Path', icon: Route },
  { href: '/projects', label: 'My Projects', icon: FolderKanban },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/ai-debugger', label: 'AI Debugger', icon: Bug },
  { href: '/interview-coach', label: 'Interview Coach', icon: Briefcase },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/profile/me', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 250 } },
  closed: { x: '-100%', transition: { type: 'spring', damping: 25, stiffness: 250 } },
};

const DESKTOP_WIDTH = 260;
const DESKTOP_COLLAPSED_WIDTH = 0;

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const { data: session } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef<HTMLElement>(null);

  const handleLogout = () => {
    setSidebarOpen(false);
    setIsLoggingOut(true);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setSidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !sidebarRef.current) return;
      const focusable = sidebarRef.current.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [sidebarOpen]);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-bg-secondary">
      <div className="flex h-16 items-center justify-between border-b border-border-default px-5 shrink-0">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent-light border border-accent/20">
            <CircuitBoard className="h-4 w-4 text-accent" />
          </div>
          <span className="text-base font-extrabold"><span className="text-text-primary">IoT</span><span className="text-accent">Copilot</span></span>
        </Link>
        <button onClick={() => setSidebarOpen(false)}
          className="flex lg:hidden items-center justify-center h-7 w-7 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-glass transition-colors"
          aria-label="Close sidebar"
        ><X size={16} /></button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 no-scrollbar" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                active
                  ? 'bg-accent-light text-accent border border-accent/20 shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-glass border border-transparent hover:border-border-default'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <item.icon size={17} className={cn('shrink-0', active ? 'text-accent' : 'text-text-tertiary')} />
              <span>{item.label}</span>
              {active && <Signal size={10} className="ml-auto text-accent animate-pulse-soft shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {user?.role === 'admin' && (
        <div className="shrink-0 border-t border-border-default p-3">
          <Link href="/admin" onClick={() => setSidebarOpen(false)}
            className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
              pathname.startsWith('/admin')
                ? 'bg-accent-light text-accent border border-accent/20 shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-glass border border-transparent hover:border-border-default'
            )}
          >
            <Shield size={17} className="shrink-0 text-text-tertiary" />
            <span>Admin</span>
          </Link>
        </div>
      )}

      <div className="shrink-0 border-t border-border-default p-3 space-y-1">
        <button onClick={handleLogout} disabled={isLoggingOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:text-error hover:bg-error-light border border-transparent hover:border-error/20 transition-all duration-200 w-full"
        >
          <LogOut size={17} className="shrink-0" />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-bg-elevated border border-border-default">
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-accent to-deep-blue flex items-center justify-center text-xs font-bold text-white ring-2 ring-border-default">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text-primary truncate">{user?.name || 'User'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-status-blink" />
              <p className="text-xs text-text-tertiary capitalize truncate">{user?.skillLevel || 'beginner'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={toggleSidebar}
        className="fixed z-40 top-[6.5rem] hidden lg:flex items-center justify-center h-9 w-6 rounded-r-xl bg-bg-secondary border border-l-0 border-border-default text-text-tertiary hover:text-text-primary hover:bg-glass transition-all duration-300 ease-in-out shadow-sm"
        style={{ left: sidebarOpen ? '260px' : '0px' }}
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
      <aside ref={sidebarRef} className="fixed left-0 top-20 z-30 hidden lg:block transition-all duration-300 ease-in-out"
        style={{ width: sidebarOpen ? DESKTOP_WIDTH : DESKTOP_COLLAPSED_WIDTH, height: 'calc(100vh - 5rem)' }}
      >
        <div className={cn('h-full overflow-hidden border-r border-border-default transition-opacity duration-300',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}>{sidebarContent}</div>
      </aside>
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }} className="sidebar-backdrop absolute inset-0"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside ref={sidebarRef} initial="closed" animate="open" exit="closed" variants={sidebarVariants}
              className="absolute left-0 top-20 bottom-0 w-[280px] max-w-[85vw] border-r border-border-default shadow-2xl bg-bg-secondary"
            >{sidebarContent}</motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
