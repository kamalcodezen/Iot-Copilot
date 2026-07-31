export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  bio: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  badges: Array<{ name: string; earnedAt: string }>;
  stats: {
    totalProjects: number;
    completedProjects: number;
    learningStreak: number;
    totalSessions: number;
    totalHours: number;
    lastActive: string;
  };
  preferences: {
    theme: 'dark';
    emailNotifications: boolean;
    language: string;
  };
  isVerified: boolean;
  createdAt: string;
}
