'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Menu, X, CircuitBoard, LayoutDashboard, User, Settings, LogOut,
  ChevronDown, Bell, Bot, FolderKanban, Bug, Route, Users,
  Home, Compass, Signal,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';
import Avatar from '@/components/ui/Avatar';

// ----------------------------------------------------------------------
// Magnetic Button Component for CTA
// ----------------------------------------------------------------------
const MagneticButton = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.25);
    y.set(middleY * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// Nav Links
// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------
// Main Navbar
// ----------------------------------------------------------------------
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);
  const { isAuthenticated, user, logout, isLoggingOut, fetchMe } = useAuthStore();
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
    const handleScroll = () => setScrolled(window.scrollY > 40);
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
        ? 'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent'
        : 'group relative flex items-center gap-2 px-3 xl:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent',
      active
        ? 'text-accent'
        : 'text-text-secondary hover:text-white'
    );

    const content = (
      <>
        {link.icon && <link.icon size={mobile ? 18 : 16} className={cn('shrink-0 transition-colors duration-300 z-10', active ? 'text-accent drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]' : 'group-hover:text-accent/70')} />}
        <span className="z-10 tracking-wide">{link.label}</span>
        {active && !mobile && (
          <motion.div
            layoutId="nav-active"
            className="absolute inset-0 rounded-full bg-accent/15 border border-accent/20 shadow-[inset_0_0_12px_rgba(20,184,166,0.15)]"
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-500 ease-out',
          scrolled || !isLanding
            ? 'top-4 mx-4 lg:mx-auto max-w-6xl rounded-full bg-teal-950/40 backdrop-blur-2xl border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.15)]'
            : 'top-0 bg-transparent'
        )}
      >
        <div className={cn('mx-auto transition-all duration-500', scrolled || !isLanding ? 'px-3 sm:px-4' : 'max-w-7xl px-4 sm:px-6 lg:px-8')}>
          <div className={cn('flex items-center justify-between transition-all duration-500', scrolled || !isLanding ? 'h-16' : 'h-24')}>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl pl-2">
              <div className="relative flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-br from-teal-500/20 to-accent/20 border border-accent/30 shadow-[0_0_15px_rgba(20,184,166,0.2)] group-hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all duration-300">
                <CircuitBoard className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-xl font-extrabold tracking-tight font-sekuya">
                <span className="text-text-primary">IoT</span><span className="text-accent drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">Copilot</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {(isAuthenticated ? appLinks : publicLinks).map((link) => renderLink(link))}
            </div>

            {/* User Actions */}
            <div className="hidden lg:flex items-center gap-3 pr-2">
              {isAuthenticated && user ? (
                <>
                  <MagneticButton>
                    <button className="relative flex items-center justify-center h-10 w-10 rounded-full text-text-tertiary hover:text-accent bg-white/5 hover:bg-white/10 backdrop-blur-md border border-transparent hover:border-accent/40 shadow-sm transition-all" aria-label="Notifications">
                      <Bell size={18} />
                      <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-accent border-2 border-teal-950 text-[8px] font-bold text-white flex items-center justify-center animate-pulse">3</span>
                    </button>
                  </MagneticButton>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-full hover:bg-white/10 border border-transparent hover:border-border-default transition-all group outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      aria-label="User menu"
                      aria-expanded={dropdownOpen}
                    >
                      <Avatar name={user.name || 'User'} size="sm" status="online" className="shadow-[0_0_10px_rgba(20,184,166,0.3)]" />
                      <div className="text-left min-w-0 max-w-[100px] hidden xl:block">
                        <p className="text-sm font-bold text-text-primary truncate">{user.name || 'User'}</p>
                      </div>
                      <ChevronDown size={14} className={cn('text-text-tertiary transition-transform duration-300 shrink-0', dropdownOpen && 'rotate-180 text-accent')} />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
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
                            <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-white hover:bg-accent/10 rounded-2xl transition-all" role="menuitem">
                              <LayoutDashboard size={16} className="text-text-tertiary" /> Dashboard
                            </Link>
                            <Link href="/profile/me" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-white hover:bg-accent/10 rounded-2xl transition-all" role="menuitem">
                              <User size={16} className="text-text-tertiary" /> Profile
                            </Link>
                            <Link href="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-white hover:bg-accent/10 rounded-2xl transition-all" role="menuitem">
                              <Settings size={16} className="text-text-tertiary" /> Settings
                            </Link>
                          </div>
                          <div className="p-2 border-t border-white/5">
                            <button onClick={handleLogout} disabled={isLoggingOut} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all w-full" role="menuitem">
                              <LogOut size={16} />
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
                  <Link href="/auth/login" className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full">
                    <button className="px-5 py-2 text-sm font-bold text-text-primary hover:text-accent transition-all duration-300 rounded-full border border-border-default hover:border-accent/40 bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-sm">
                      Login
                    </button>
                  </Link>
                  <MagneticButton>
                    <Link href="/auth/register" className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full block">
                      <button className="px-6 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-accent to-teal-400 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all duration-300 hover:scale-105">
                        Register
                      </button>
                    </Link>
                  </MagneticButton>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="flex lg:hidden items-center justify-center h-10 w-10 rounded-full text-text-secondary hover:text-white hover:bg-white/10 border border-transparent transition-all touch-target"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="sidebar-backdrop absolute inset-0 backdrop-blur-sm bg-black/40"
              onClick={() => setMobileOpen(false)}
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
                  <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                    <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-accent/20 border border-accent/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                      <CircuitBoard className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-xl font-extrabold font-sekuya"><span className="text-text-primary">IoT</span><span className="text-accent drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">Copilot</span></span>
                  </Link>
                  <button onClick={() => setMobileOpen(false)} className="flex items-center justify-center h-10 w-10 rounded-full text-text-tertiary hover:text-white hover:bg-white/10 transition-colors" aria-label="Close menu">
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

                  {(isAuthenticated ? appLinks : publicLinks).map((link) => renderLink(link, true))}

                  {isAuthenticated && (
                    <>
                      <div className="border-t border-white/5 my-4" />
                      <Link href="/profile/me" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300">
                        <User size={18} className="shrink-0 text-text-tertiary" /> My Profile
                      </Link>
                      <Link href="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300">
                        <Settings size={18} className="shrink-0 text-text-tertiary" /> Account Settings
                      </Link>
                    </>
                  )}
                </div>

                <div className="shrink-0 border-t border-white/5 p-5 bg-white/5">
                  {isAuthenticated ? (
                    <button onClick={handleLogout} disabled={isLoggingOut} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full">
                      <LogOut size={18} />
                      {isLoggingOut ? 'Signing out...' : 'Logout'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="block">
                        <button className="w-full px-5 py-3 text-sm font-bold rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all">Login</button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="block">
                        <button className="w-full px-5 py-3 text-sm font-bold rounded-2xl bg-gradient-to-r from-accent to-teal-400 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all">Register</button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Bottom Nav */}
      {isAuthenticated && (
        <nav
          className="fixed bottom-4 left-4 right-4 z-40 lg:hidden bg-teal-950/80 backdrop-blur-2xl border border-teal-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.1)] rounded-full safe-area-bottom pb-1 pt-1"
          aria-label="Mobile bottom navigation"
        >
          <div className="flex items-center justify-around px-2">
            {bottomNavItems.map((item) => {
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
                    <item.icon size={20} aria-hidden="true" className={cn(active && "drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]")} />
                  </div>
                  <span className={cn(
                    "text-[10px] leading-tight text-center truncate font-bold relative z-10 transition-all duration-300",
                    active ? "opacity-100 translate-y-0" : "opacity-70 group-hover:opacity-100"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
