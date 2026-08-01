"use server";

import { serverFetch } from '../core/server';
import { LearningPath, ApiResponse } from '@/types';

export const getLearningPaths = async () => {
  return await serverFetch<ApiResponse<LearningPath[]>>('/learning-paths');
};

export const getLearningPath = async (id: string) => {
  return await serverFetch<ApiResponse<LearningPath>>(`/learning-paths/${id}`);
};
