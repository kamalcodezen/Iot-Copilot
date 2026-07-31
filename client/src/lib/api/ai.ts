import { protectedFetch } from '../core/server';
import { ApiResponse } from '@/types';

export const getChatHistory = async () => {
  return await protectedFetch('/ai/chat/history') as ApiResponse<any[]>;
};

export const getRecommendations = async () => {
  return await protectedFetch('/ai/recommend') as ApiResponse<string>;
};
