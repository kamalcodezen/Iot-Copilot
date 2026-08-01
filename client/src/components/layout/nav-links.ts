import { Home, Bot, LayoutDashboard, FolderKanban, Bug, Route, Users, Compass, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  icon?: LucideIcon;
}

export const publicLinks: NavLink[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#features', label: 'Features' },
  { href: '/ai-mentor', label: 'AI Mentor', icon: Bot },
  { href: '/contact', label: 'Contact' },
];

export const appLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/ai-mentor', label: 'AI Mentor', icon: Bot },
  { href: '/ai-debugger', label: 'Debugger', icon: Bug },
  { href: '/learning-path', label: 'Learning', icon: Route },
  { href: '/community', label: 'Community', icon: Users },
];

export const bottomNavItems: NavLink[] = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/ai-mentor', label: 'AI', icon: Bot },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/profile/me', label: 'Profile', icon: User },
];
