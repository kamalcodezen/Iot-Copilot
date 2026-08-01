'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Menu, X, CircuitBoard, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';
import Avatar from '@/components/ui/Avatar';
import NavbarUserMenu from './NavbarUserMenu';
import MobileSidebar from './MobileSidebar';
import BottomNavBar from './BottomNavBar';
import { NavLink, publicLinks, appLinks, bottomNavItems } from './nav-links';

// Follows the cursor slightly so CTA buttons feel magnetic.
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const fetchedRef = useRef(false);
  const { isAuthenticated, user, logout, isLoggingOut, fetchMe } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      // Only fetch if we are not already authenticated
      if (!isAuthenticated) {
        fetchMe();
      }
    }
  }, [fetchMe, isAuthenticated]);

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

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const renderLink = (link: NavLink) => {
    const active = isActive(link.href);
    const isHash = link.href.startsWith('/#');

    const classes = cn(
      'group relative flex items-center gap-2 px-3 xl:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent',
      active ? 'text-accent' : 'text-text-secondary hover:text-white'
    );

    const content = (
      <>
        {link.icon && <link.icon size={16} className={cn('shrink-0 transition-colors duration-300 z-10', active ? 'text-accent drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]' : 'group-hover:text-accent/70')} />}
        <span className="z-10 tracking-wide">{link.label}</span>
        {active && (
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
              <span className="text-xl font-extrabold tracking-tight">
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

                  <NavbarUserMenu user={user} isLoggingOut={isLoggingOut} onLogout={handleLogout} />
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="inline-flex items-center px-5 py-2 text-sm font-bold text-text-primary hover:text-accent transition-all duration-300 rounded-full border border-border-default hover:border-accent/40 bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-accent">
                    Login
                  </Link>
                  <MagneticButton>
                    <Link href="/auth/register" className="inline-flex items-center px-6 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-accent to-teal-400 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all duration-300 hover:scale-105">
                      Register
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

      <MobileSidebar
        open={mobileOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        isLoggingOut={isLoggingOut}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        links={isAuthenticated ? appLinks : publicLinks}
      />

      {/* Mobile Floating Bottom Nav */}
      {isAuthenticated && <BottomNavBar items={bottomNavItems} />}
    </>
  );
}
