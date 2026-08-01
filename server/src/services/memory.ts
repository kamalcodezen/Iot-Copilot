import AIMemory from '../models/AIMemory';
import type { AIMemoryType } from '../models/AIMemory';

export interface MemoryMetadata {
  topic?: string;
  projectId?: string;
  codeSnippet?: string;
  componentRefs?: string[];
}

export const saveMemory = async (
  userId: string,
  type: AIMemoryType,
  role: 'user' | 'assistant',
  content: string,
  metadata: MemoryMetadata = {}
) => {
  return AIMemory.create({ userId, type, role, content, metadata });
};

export const getRecentMemory = async (userId: string, limit: number = 10) => {
  return AIMemory.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const getMemoryByType = async (userId: string, type: AIMemoryType, limit: number = 20) => {
  return AIMemory.find({ userId, type })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Turns a list of memories into the "previous conversation" section of a prompt.
export const buildContextString = (memories: Array<{ role: string; content: string }>): string => {
  if (memories.length === 0) return 'No previous context.';
  return memories
    .reverse()
    .map((m) => `[${m.role === 'user' ? 'User' : 'Engineer'}]: ${m.content.slice(0, 500)}`)
    .join('\n');
};
