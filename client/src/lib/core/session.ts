import { redirect } from 'next/navigation';
import { serverFetch } from './server';
import { User } from '@/types';
import { cookies } from 'next/headers';

export interface SessionData {
  user: User;
  session: {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    expiresAt: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

export const getUserSession = async () => {
  try {
    const data = await serverFetch<SessionData>('/auth/get-session');
    if (!data || !data.user) return null;
    
    const user = { ...data.user };
    if (typeof user.socialLinks === 'string') {
      try { user.socialLinks = JSON.parse(user.socialLinks); } catch (e) {}
    }
    if (typeof user.preferences === 'string') {
      try { user.preferences = JSON.parse(user.preferences); } catch (e) {}
    }

    return { ...data, user };
  } catch (error) {
    return null;
  }
};

export const requireAuth = async () => {
  const session = await getUserSession();
  if (!session) {
    redirect('/auth/login');
  }
  return session;
};

export const requireRole = async (role: string) => {
  const session = await requireAuth();
  if (session.user.role !== 'admin' && session.user.role !== role) {
    redirect('/dashboard');
  }
  return session.user;
};

export const getUserToken = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('better-auth.session_token');
  return sessionCookie?.value || null;
};
