import { create } from 'zustand';
import { User } from '@/types';
import { authClient } from '@/lib/auth-client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

function mapBetterAuthUser(betterUser: any): User {
  const socialLinks = typeof betterUser.socialLinks === 'string'
    ? JSON.parse(betterUser.socialLinks)
    : betterUser.socialLinks || { github: '', linkedin: '', twitter: '' };
  const preferences = typeof betterUser.preferences === 'string'
    ? JSON.parse(betterUser.preferences)
    : betterUser.preferences || { theme: 'dark', emailNotifications: true, language: 'en' };

  return {
    id: betterUser.id,
    name: betterUser.name || '',
    email: betterUser.email || '',
    role: betterUser.role || 'user',
    avatar: betterUser.image || '',
    skillLevel: betterUser.skillLevel || 'beginner',
    bio: betterUser.bio || '',
    socialLinks,
    badges: betterUser.badges || [],
    stats: betterUser.stats || {
      totalProjects: 0,
      completedProjects: 0,
      learningStreak: 0,
      totalSessions: 0,
      totalHours: 0,
      lastActive: new Date().toISOString(),
    },
    preferences,
    isVerified: betterUser.emailVerified || false,
    createdAt: betterUser.createdAt || new Date().toISOString(),
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isLoggingOut: false,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  login: async (email, password) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw error;
    if (!data?.user) throw new Error('Login failed');
    const user = mapBetterAuthUser(data.user);
    set({ user, isAuthenticated: true, isLoading: false });
    return user;
  },

  register: async (name, email, password) => {
    const { data, error } = await authClient.signUp.email({ name, email, password });
    if (error) throw error;
    if (!data?.user) throw new Error('Registration failed');
    const user = mapBetterAuthUser(data.user);
    set({ user, isAuthenticated: true, isLoading: false });
    return user;
  },

  signInWithGoogle: async () => {
    const { data, error } = await authClient.signIn.social({ provider: 'google' });
    if (error) throw error;
    if (data?.url) {
      window.location.href = data.url;
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await authClient.signOut();
    } catch {
      // Proceed with clearing state even if API call fails
    }
    set({ user: null, isAuthenticated: false, isLoading: false, isLoggingOut: false });
  },

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await authClient.getSession();
      if (error || !data) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      set({ user: mapBetterAuthUser(data.user), isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
