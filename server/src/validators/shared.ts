import { z } from 'zod';
import { PROJECT_CATEGORIES, PROJECT_STATUSES, SKILL_LEVELS } from '../utils/constants';

// Shared building blocks used by every domain validator.
export const mongoIdSchema = z.string().regex(/^[a-f0-9]{24}$/, 'Invalid MongoDB ID');

export const mongoIdParams = z.object({ id: mongoIdSchema });

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(128);

export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100);

export const projectCategoryEnum = z.enum(PROJECT_CATEGORIES);
export const projectStatusEnum = z.enum(PROJECT_STATUSES);
export const skillLevelEnum = z.enum(SKILL_LEVELS);
