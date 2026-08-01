'use server';

import { serverMutation } from '../core/server';
import { ApiResponse, LearningPath } from '@/types';

export const generateRoadmapAction = async (skillLevel: string, goals: string) => {
  return await serverMutation<ApiResponse<LearningPath>>('/ai/roadmap', { skillLevel, goals }, 'POST');
};

export const recommendComponentsAction = async (project: string, budget: string) => {
  return await serverMutation<ApiResponse<string>>('/ai/recommend-components', { project, budget }, 'POST');
};

export const planProjectAction = async (idea: string, skillLevel: string) => {
  return await serverMutation<ApiResponse<string>>('/ai/plan-project', { idea, skillLevel }, 'POST');
};

export const getInterviewQuestionsAction = async (experienceLevel: string, topic: string) => {
  return await serverMutation<ApiResponse<string>>('/ai/interview', { experienceLevel, topic }, 'POST');
};

export const submitInterviewAnswerAction = async (question: string, answer: string, experienceLevel: string) => {
  return await serverMutation<ApiResponse<string>>('/ai/interview/submit', { question, answer, experienceLevel }, 'POST');
};
