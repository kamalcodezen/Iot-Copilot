import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['smart-home', 'agriculture', 'healthcare', 'automation', 'robotics', 'other']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  status: z.enum(['planning', 'in-progress', 'completed', 'paused']),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(500).optional(),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  socialLinks: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }),
});
