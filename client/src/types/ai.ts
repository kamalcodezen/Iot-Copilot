export interface AIMemory {
  _id: string;
  userId: string;
  type: 'mentor' | 'debug' | 'interview' | 'roadmap' | 'recommendation';
  role: 'user' | 'assistant';
  content: string;
  metadata: {
    topic: string;
    projectId?: string;
    codeSnippet: string;
    componentRefs: string[];
  };
  createdAt: string;
}
