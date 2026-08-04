import { User } from '@/types';

// The server stores extra profile data (role, skill level, badges, stats)
// as extra fields on the better-auth user document, but better-auth's client
// types don't know about them, so describe the fields we read here.
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string | Date;
  role?: string | null;
  skillLevel?: string | null;
  bio?: string | null;
  socialLinks?: string | null;
  preferences?: string | null;
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
function parseProfile<T>(value: string | null | undefined, fallback: T): T {
  if (value === undefined || value === null) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// Adapts the better-auth session user to the shape the UI renders.
export function mapSessionUser(sessionUser: SessionUser): User {
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
