"use server";

import { serverFetch } from '../core/server';
import { LearningPath, ApiResponse } from '@/types';

export const getLearningPaths = async () => {
  return await serverFetch('/learning-paths') as ApiResponse<LearningPath[]>;
};

export const getLearningPath = async (id: string) => {
  return await serverFetch(`/learning-paths/${id}`) as ApiResponse<LearningPath>;
};
