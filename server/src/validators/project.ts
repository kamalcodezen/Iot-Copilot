import { z } from 'zod';
import { paginationSchema, projectCategoryEnum, projectStatusEnum, skillLevelEnum } from './shared';

export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  category: projectCategoryEnum,
  difficulty: skillLevelEnum,
  status: projectStatusEnum.default('planning'),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  components: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    link: z.string().optional(),
  })).optional(),
  circuitDescription: z.string().optional(),
  code: z.string().optional(),
  learningOutcomes: z.array(z.string()).optional(),
  timeline: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
  images: z.array(z.string()).optional(),
});

export const projectUpdateSchema = projectSchema.partial();

export const progressSchema = z.object({
  progress: z.number().int().min(0).max(100),
});

export const projectQuerySchema = paginationSchema.extend({
  status: projectStatusEnum.optional(),
  category: projectCategoryEnum.optional(),
  difficulty: skillLevelEnum.optional(),
});
