import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'user' | 'admin';
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  category?: string;
  difficulty?: string;
  sort?: string;
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
}
