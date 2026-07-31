'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, CircuitBoard, LayoutDashboard, User, Settings, LogOut,
  ChevronDown, Bell, Bot, FolderKanban, Bug, Route, Users,
  BookOpen, Home, HelpCircle, Compass, Signal,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';
import Avatar from '@/components/ui/Avatar';

type NavLink = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
};

const publicLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#features', label: 'Features' },
  { href: '/ai-mentor', label: 'AI Mentor', icon: Bot },
  { href: '/contact', label: 'Contact' },
];

const appLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/ai-mentor', label: 'AI Mentor', icon: Bot },
  { href: '/ai-debugger', label: 'Debugger', icon: Bug },
  { href: '/learning-path', label: 'Learning', icon: Route },
  { href: '/community', label: 'Community', icon: Users },
];

const bottomNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/ai-mentor', label: 'AI', icon: Bot },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/profile/me', label: 'Profile', icon: User },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);
  const { isAuthenticated, isLoading, user, logout, isLoggingOut, fetchMe } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchMe();
    }
  }, [fetchMe]);

  const isLanding = pathname === '/';

  useEffect(() => {
    if (!isLanding) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLanding]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDropdownOpen(false); setMobileOpen(false); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await logout();
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const renderLink = (link: NavLink, mobile?: boolean) => {
    const active = isActive(link.href);
    const isHash = link.href.startsWith('/#');

    const classes = cn(
      mobile
        ? 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200'
        : 'relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
      active
        ? 'text-accent'
        : 'text-text-secondary hover:text-text-primary'
    );

    const content = (
      <>
        {link.icon && <link.icon size={mobile ? 18 : 16} className={cn('shrink-0', active && 'text-accent')} />}
        <span>{link.label}</span>
        {active && !mobile && (
          <motion.div
            layoutId="nav-active"
            className="absolute inset-0 rounded-xl bg-accent-light"
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          />
        )}
      </>
    );

    if (isHash) {
      return <a key={link.href} href={link.href} className={classes}>{content}</a>;
    }

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => { setMobileOpen(false); }}
        className={classes}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </Link>
    );
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || !isLanding
            ? 'bg-glass border-b border-border-default shadow-elevation-glass'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-accent-light border border-accent/20">
                <CircuitBoard className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-text-primary">IoT</span><span className="text-accent">Copilot</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {(isAuthenticated ? appLinks : publicLinks).map((link) => renderLink(link))}
            </div>

            <div className="hidden lg:flex items-center gap-2">
              {isAuthenticated && user ? (
                <>
                  <button className="relative flex items-center justify-center h-9 w-9 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-glass border border-transparent hover:border-border-default transition-all" aria-label="Notifications">
                    <Bell size={17} />
                    <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-accent border-2 border-bg-primary text-[8px] font-bold text-white flex items-center justify-center animate-scale-fade-in">3</span>
                  </button>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-glass border border-transparent hover:border-border-default transition-all group"
                      aria-label="User menu"
                      aria-expanded={dropdownOpen}
                    >
                      <Avatar name={user.name || 'User'} size="sm" status="online" />
                      <div className="text-left min-w-0 max-w-[100px] hidden xl:block">
                        <p className="text-sm font-bold text-text-primary truncate">{user.name || 'User'}</p>
                        <p className="text-[10px] text-text-tertiary truncate font-medium">{user.email || ''}</p>
                      </div>
                      <ChevronDown size={13} className={cn('text-text-tertiary transition-transform duration-200 shrink-0', dropdownOpen && 'rotate-180')} />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-bg-elevated border border-border-default rounded-2xl shadow-elevation-high overflow-hidden z-50"
                          role="menu"
                        >
                          <div className="p-2 border-b border-border-default">
                            <div className="flex items-center gap-3 px-3 py-2">
                              <Avatar name={user.name || 'User'} size="md" />
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-text-primary truncate">{user.name || 'User'}</p>
                                <p className="text-xs text-text-tertiary truncate">{user.email || ''}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-1.5 space-y-0.5">
                            <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-glass rounded-xl transition-colors" role="menuitem">
                              <LayoutDashboard size={15} className="text-text-tertiary" /> Dashboard
                            </Link>
                            <Link href="/profile/me" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-glass rounded-xl transition-colors" role="menuitem">
                              <User size={15} className="text-text-tertiary" /> Profile
                            </Link>
                            <Link href="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-glass rounded-xl transition-colors" role="menuitem">
                              <Settings size={15} className="text-text-tertiary" /> Settings
                            </Link>
                          </div>
                          <div className="p-1.5 border-t border-border-default">
                            <button onClick={handleLogout} disabled={isLoggingOut} className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-error hover:text-error hover:bg-error-light rounded-xl transition-colors w-full" role="menuitem">
                              <LogOut size={15} />
                              {isLoggingOut ? 'Signing out...' : 'Logout'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <button className="px-5 py-2.5 text-sm font-bold text-text-primary hover:text-accent transition-colors rounded-xl border border-border-default hover:border-accent/50 bg-bg-elevated shadow-sm">
                      Login
                    </button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="px-6 py-2.5 text-sm font-bold rounded-xl bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20 transition-all">
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>

            <button
              className="flex lg:hidden items-center justify-center h-10 w-10 rounded-xl text-text-secondary hover:text-text-primary hover:bg-glass border border-transparent hover:border-border-default transition-all touch-target"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sidebar-backdrop absolute inset-0"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="absolute right-0 top-0 h-full w-[300px] max-w-[85vw] bg-bg-secondary border-l border-border-default shadow-2xl"
              aria-label="Mobile navigation"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between h-16 border-b border-border-default px-5 shrink-0">
                  <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent-light border border-accent/20">
                      <CircuitBoard className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-base font-extrabold"><span className="text-text-primary">IoT</span><span className="text-accent">Copilot</span></span>
                  </Link>
                  <button onClick={() => setMobileOpen(false)} className="flex items-center justify-center h-8 w-8 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-glass transition-colors" aria-label="Close menu">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {isAuthenticated && user && (
                    <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-2xl bg-glass border border-border-default">
                      <Avatar name={user.name || 'User'} size="md" status="online" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-text-primary truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-text-tertiary truncate font-medium">{user.email || ''}</p>
                      </div>
                      <Signal size={14} className="text-success shrink-0" />
                    </div>
                  )}

                  {(isAuthenticated ? appLinks : publicLinks).map((link) => renderLink(link, true))}

                  {isAuthenticated && (
                    <>
                      <div className="border-t border-border-default my-3" />
                      <Link href="/profile/me" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-glass transition-all duration-200">
                        <User size={18} className="shrink-0 text-text-tertiary" /> My Profile
                      </Link>
                      <Link href="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-glass transition-all duration-200">
                        <Settings size={18} className="shrink-0 text-text-tertiary" /> Account Settings
                      </Link>
                    </>
                  )}
                </div>

                <div className="shrink-0 border-t border-border-default p-4">
                  {isAuthenticated ? (
                    <button onClick={handleLogout} disabled={isLoggingOut} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-error hover:text-error hover:bg-error-light transition-all duration-200 w-full">
                      <LogOut size={18} />
                      {isLoggingOut ? 'Signing out...' : 'Logout'}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                        <button className="w-full px-4 py-2.5 text-sm font-bold rounded-xl border border-border-default text-text-secondary hover:text-text-primary hover:bg-glass transition-colors">Login</button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                        <button className="w-full px-4 py-2.5 text-sm font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-all">Register</button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {isAuthenticated && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-bg-secondary/90 backdrop-blur-lg border-t border-border-default safe-area-bottom"
          aria-label="Mobile bottom navigation"
        >
          <div className="flex items-center justify-around px-1 py-0.5">
            {bottomNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0',
                    active ? 'text-accent' : 'text-text-tertiary hover:text-text-secondary'
                  )}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                >
                  <div className={cn('p-1 rounded-lg transition-colors', active && 'bg-accent-light')}>
                    <item.icon size={20} aria-hidden="true" />
                  </div>
                  <span className="text-[10px] leading-tight text-center truncate w-full font-bold mt-0.5">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
