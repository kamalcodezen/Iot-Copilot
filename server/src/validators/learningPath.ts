import { z } from 'zod';
import { skillLevelEnum } from './shared';

export const learningPathUpdateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(5000).optional(),
  level: skillLevelEnum.optional(),
  isActive: z.boolean().optional(),
  modules: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
    resources: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(['video', 'article', 'doc']),
    })).optional(),
    estimatedHours: z.number().optional(),
  })).optional(),
});
