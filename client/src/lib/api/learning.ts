import { clientFetch } from './client-api';
import { LearningPath, ApiResponse } from '@/types';

export const getLearningPaths = async () => {
  return await clientFetch<ApiResponse<LearningPath[]>>('/learning-paths');
};

export const getLearningPath = async (id: string) => {
  return await clientFetch<ApiResponse<LearningPath>>(`/learning-paths/${id}`);
};
