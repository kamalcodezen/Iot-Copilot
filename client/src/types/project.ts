export interface Project {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: 'smart-home' | 'agriculture' | 'healthcare' | 'automation' | 'robotics' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'planning' | 'in-progress' | 'completed' | 'paused';
  components: Array<{ name: string; quantity: number; link: string }>;
  circuitDescription: string;
  code: string;
  images: string[];
  learningOutcomes: string[];
  progress: number;
  timeline: { start: string; end: string };
  isPublic: boolean;
  likes: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedProject extends Omit<Project, 'userId'> {
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
}
