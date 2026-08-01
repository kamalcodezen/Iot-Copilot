import { create } from 'zustand';
import { User } from '@/types';
import { authClient } from '@/lib/auth-client';

// The server stores extra profile data (role, skill level, badges, stats)
// as extra fields on the better-auth user document, but better-auth's client
// types don't know about them, so describe the fields we read here.
interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string | Date;
  role?: string;
  skillLevel?: string;
  bio?: string;
  socialLinks?: string;
  preferences?: string;
  badges?: string[];
  totalSessions?: number;
  totalHours?: number;
  totalProjects?: number;
  completedProjects?: number;
  learningStreak?: number;
  lastActive?: string;
}

// JSON.parse returns any, so the generic cast gives the parsed profile
// objects their real shapes.
function parseProfile<T>(value: string | undefined, fallback: T): T {
  if (value === undefined) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapBetterAuthUser(sessionUser: SessionUser): User {
  return {
    id: sessionUser.id,
    name: sessionUser.name || '',
    email: sessionUser.email || '',
    // The server validates both fields, so the string casts are safe.
    role: (sessionUser.role || 'user') as User['role'],
    skillLevel: (sessionUser.skillLevel || 'beginner') as User['skillLevel'],
    avatar: sessionUser.image || '',
    bio: sessionUser.bio || '',
    socialLinks: parseProfile(sessionUser.socialLinks, { github: '', linkedin: '', twitter: '' }),
    badges: sessionUser.badges || [],
    stats: {
      totalProjects: sessionUser.totalProjects ?? 0,
      completedProjects: sessionUser.completedProjects ?? 0,
      learningStreak: sessionUser.learningStreak ?? 0,
      totalSessions: sessionUser.totalSessions ?? 0,
      totalHours: sessionUser.totalHours ?? 0,
      lastActive: sessionUser.lastActive || new Date().toISOString(),
    },
    preferences: parseProfile(sessionUser.preferences, { theme: 'dark', emailNotifications: true, language: 'en' }),
    isVerified: sessionUser.emailVerified || false,
    createdAt: sessionUser.createdAt ? new Date(sessionUser.createdAt).toISOString() : new Date().toISOString(),
  };
}

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
      if (error || !data?.user) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      set({ user: mapBetterAuthUser(data.user), isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
