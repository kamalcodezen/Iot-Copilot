export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const PROJECT_CATEGORIES = [
  'smart-home',
  'agriculture',
  'healthcare',
  'automation',
  'robotics',
  'other',
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = ['planning', 'in-progress', 'completed', 'paused'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const ACTIVITY_TYPES = [
  'project_created',
  'project_completed',
  'mentor_session',
  'debug_session',
  'interview_practice',
  'roadmap_started',
  'roadmap_completed',
  'badge_earned',
  'login',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const AI_RATE_LIMIT = {
  WINDOW_MS: 60 * 1000,
  MAX_REQUESTS: 30,
};
