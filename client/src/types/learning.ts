export interface LearningPath {
  _id: string;
  userId: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  modules: Array<{
    title: string;
    description: string;
    order: number;
    status: 'locked' | 'available' | 'in-progress' | 'completed';
    resources: Array<{ title: string; url: string; type: 'video' | 'article' | 'doc' }>;
    estimatedHours: number;
  }>;
  progress: number;
  isActive: boolean;
  completedAt?: string;
  createdAt: string;
}
