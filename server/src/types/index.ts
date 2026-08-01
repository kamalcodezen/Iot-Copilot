import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'admin';
  };
}

export interface AIRequest {
  message: string;
  context?: string;
  projectId?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  board?: string;
  components?: string[];
  error?: string;
  experienceLevel?: 'fresher' | 'intermediate' | 'senior';
  topic?: string;
  answer?: string;
  goals?: string;
  project?: string;
  budget?: string;
  idea?: string;
  page?: string;
  pageInfo?: string;
  question?: string;
}
