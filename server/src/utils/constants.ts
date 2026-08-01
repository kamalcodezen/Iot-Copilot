export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export const PROJECT_CATEGORIES = [
  'smart-home',
  'agriculture',
  'healthcare',
  'automation',
  'robotics',
  'other',
] as const;

export const PROJECT_STATUSES = ['planning', 'in-progress', 'completed', 'paused'] as const;

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

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
};

export const AI_RATE_LIMIT = {
  WINDOW_MS: 60 * 1000,
  MAX_REQUESTS: 30,
};
