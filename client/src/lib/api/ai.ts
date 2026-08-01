import { protectedFetch } from '../core/server';
import { AIMemory, ApiResponse } from '@/types';

export const getChatHistory = async () => {
  return await protectedFetch<ApiResponse<AIMemory[]>>('/ai/chat/history');
};

export const getRecommendations = async () => {
  return await protectedFetch<ApiResponse<string>>('/ai/recommend');
};
