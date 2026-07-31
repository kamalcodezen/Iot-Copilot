'use server';

import { serverMutation } from '../core/server';
import { ApiResponse, LearningPath } from '@/types';

export const generateRoadmapAction = async (skillLevel: string, goals: string) => {
  return await serverMutation('/ai/roadmap', { skillLevel, goals }, 'POST') as ApiResponse<LearningPath>;
};

export const recommendComponentsAction = async (project: string, budget: string) => {
  return await serverMutation('/ai/recommend-components', { project, budget }, 'POST') as ApiResponse<string>;
};

export const planProjectAction = async (idea: string, skillLevel: string) => {
  return await serverMutation('/ai/plan-project', { idea, skillLevel }, 'POST') as ApiResponse<string>;
};

export const getInterviewQuestionsAction = async (experienceLevel: string, topic: string) => {
  return await serverMutation('/ai/interview', { experienceLevel, topic }, 'POST') as ApiResponse<string>;
};

export const submitInterviewAnswerAction = async (question: string, answer: string, experienceLevel: string) => {
  return await serverMutation('/ai/interview/submit', { question, answer, experienceLevel }, 'POST') as ApiResponse<string>;
};
