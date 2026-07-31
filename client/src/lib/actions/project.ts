'use server';

import { serverMutation } from '../core/server';
import { Project, ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export const createProjectAction = async (data: Partial<Project>) => {
  const result = await serverMutation('/projects', data, 'POST') as ApiResponse<Project>;
  revalidatePath('/projects');
  revalidatePath('/dashboard');
  return result;
};

export const updateProjectAction = async (id: string, data: Partial<Project>) => {
  const result = await serverMutation(`/projects/${id}`, data, 'PUT') as ApiResponse<Project>;
  revalidatePath(`/projects/${id}`);
  revalidatePath('/projects');
  return result;
};

export const deleteProjectAction = async (id: string) => {
  const result = await serverMutation(`/projects/${id}`, undefined, 'DELETE');
  revalidatePath('/projects');
  revalidatePath('/dashboard');
  return result;
};

export const updateProjectProgressAction = async (id: string, progress: number) => {
  const result = await serverMutation(`/projects/${id}/progress`, { progress }, 'PATCH') as ApiResponse<Project>;
  revalidatePath(`/projects/${id}`);
  revalidatePath('/dashboard');
  return result;
};

export const toggleProjectLikeAction = async (id: string) => {
  const result = await serverMutation(`/projects/${id}/like`, undefined, 'POST');
  revalidatePath(`/projects/${id}`);
  revalidatePath('/projects');
  return result;
};
