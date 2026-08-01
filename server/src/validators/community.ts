import { z } from 'zod';
import { paginationSchema, projectCategoryEnum, skillLevelEnum } from './shared';

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000),
});

export const communityQuerySchema = paginationSchema.extend({
  category: projectCategoryEnum.optional(),
  difficulty: skillLevelEnum.optional(),
  sort: z.string().optional(),
});
