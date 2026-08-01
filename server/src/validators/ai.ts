import { z } from 'zod';
import { skillLevelEnum } from './shared';

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
  skillLevel: skillLevelEnum.optional(),
  goals: z.string().optional(),
});

export const recommendComponentsSchema = z.object({
  project: z.string().optional(),
  budget: z.string().optional(),
});

export const planProjectSchema = z.object({
  idea: z.string().min(1, 'Project idea is required'),
  skillLevel: skillLevelEnum.optional(),
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
