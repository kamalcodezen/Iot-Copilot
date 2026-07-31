'use server';

import { serverMutation } from '../core/server';
import { LearningPath, ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export const updateLearningPathAction = async (id: string, data: Partial<LearningPath>) => {
  const result = await serverMutation(`/learning-paths/${id}`, data, 'PUT') as ApiResponse<LearningPath>;
  revalidatePath(`/learning-paths/${id}`);
  revalidatePath('/learning-paths');
  return result;
};

export const deleteLearningPathAction = async (id: string) => {
  const result = await serverMutation(`/learning-paths/${id}`, undefined, 'DELETE');
  revalidatePath('/learning-paths');
  return result;
};
