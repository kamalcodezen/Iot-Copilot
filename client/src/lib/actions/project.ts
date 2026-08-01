'use server';

import { serverMutation } from '../core/server';
import { Project, ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export const createProjectAction = async (data: Partial<Project>) => {
  const result = await serverMutation<ApiResponse<Project>>('/projects', data, 'POST');
  revalidatePath('/projects');
  revalidatePath('/dashboard');
  return result;
};

export const updateProjectAction = async (id: string, data: Partial<Project>) => {
  const result = await serverMutation<ApiResponse<Project>>(`/projects/${id}`, data, 'PUT');
  revalidatePath(`/projects/${id}`);
  revalidatePath('/projects');
  return result;
};

export const deleteProjectAction = async (id: string) => {
  const result = await serverMutation<ApiResponse<unknown>>(`/projects/${id}`, undefined, 'DELETE');
  revalidatePath('/projects');
  revalidatePath('/dashboard');
  return result;
};

export const updateProjectProgressAction = async (id: string, progress: number) => {
  const result = await serverMutation<ApiResponse<Project>>(`/projects/${id}/progress`, { progress }, 'PATCH');
  revalidatePath(`/projects/${id}`);
  revalidatePath('/dashboard');
  return result;
};

export const toggleProjectLikeAction = async (id: string) => {
  const result = await serverMutation<ApiResponse<{ likes: number }>>(`/projects/${id}/like`, undefined, 'POST');
  revalidatePath(`/projects/${id}`);
  revalidatePath('/projects');
  return result;
};
