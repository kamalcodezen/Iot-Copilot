import { z } from 'zod';
import { emailSchema, passwordSchema, nameSchema, skillLevelEnum } from './shared';

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

export const updateRoleSchema = z.object({
  role: z.enum(['user', 'admin']),
});

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  bio: z.string().max(500).optional(),
  skillLevel: skillLevelEnum.optional(),
  socialLinks: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
  preferences: z.object({
    theme: z.enum(['dark']).optional(),
    emailNotifications: z.boolean().optional(),
    language: z.string().optional(),
  }).optional(),
});
