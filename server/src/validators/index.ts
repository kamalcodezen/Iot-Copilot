import { z } from 'zod';

export const mongoIdSchema = z.string().regex(/^[a-f0-9]{24}$/, 'Invalid MongoDB ID');

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(128);

export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100);

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
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
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

export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  category: z.enum(['smart-home', 'agriculture', 'healthcare', 'automation', 'robotics', 'other']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  status: z.enum(['planning', 'in-progress', 'completed', 'paused']).default('planning'),
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

export const progressSchema = z.object({
  progress: z.number().int().min(0).max(100),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000),
});

export const mongoIdParams = z.object({ id: mongoIdSchema });

export const projectQuerySchema = paginationSchema.extend({
  status: z.enum(['planning', 'in-progress', 'completed', 'paused']).optional(),
  category: z.enum(['smart-home', 'agriculture', 'healthcare', 'automation', 'robotics', 'other']).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

export const projectUpdateSchema = projectSchema.partial();

export const aiChatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  context: z.string().optional(),
  projectId: z.string().optional(),
});

export const assistantChatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000),
  page: z.string().max(100).optional(),
  pageInfo: z.string().max(500).optional(),
});

export const generateRoadmapSchema = z.object({
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  goals: z.string().optional(),
});

export const recommendComponentsSchema = z.object({
  project: z.string().optional(),
  budget: z.string().optional(),
});

export const planProjectSchema = z.object({
  idea: z.string().min(1, 'Project idea is required'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

export const aiDebugSchema = z.object({
  message: z.string().optional(),
  board: z.string().optional(),
  components: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export const interviewQuestionsSchema = z.object({
  experienceLevel: z.string().optional(),
  topic: z.string().optional(),
});

export const submitInterviewAnswerSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  experienceLevel: z.string().optional(),
});

export const learningPathUpdateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(5000).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  isActive: z.boolean().optional(),
  modules: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
    resources: z.array(z.any()).optional(),
    estimatedHours: z.number().optional(),
  })).optional(),
});

export const communityQuerySchema = paginationSchema.extend({
  category: z.enum(['smart-home', 'agriculture', 'healthcare', 'automation', 'robotics', 'other']).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  sort: z.string().optional(),
});
