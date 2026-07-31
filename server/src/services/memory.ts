import AIMemory from '../models/AIMemory';

export const saveMemory = async (
  userId: string,
  type: string,
  role: 'user' | 'assistant',
  content: string,
  metadata: any = {}
) => {
  return AIMemory.create({ userId, type, role, content, metadata });
};

export const getRecentMemory = async (userId: string, limit: number = 10) => {
  return AIMemory.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const getMemoryByType = async (userId: string, type: string, limit: number = 20) => {
  return AIMemory.find({ userId, type })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const buildContextString = (memories: any[]): string => {
  if (memories.length === 0) return 'No previous context.';
  return memories
    .reverse()
    .map((m) => `[${m.role === 'user' ? 'User' : 'Engineer'}]: ${m.content.slice(0, 500)}`)
    .join('\n');
};
