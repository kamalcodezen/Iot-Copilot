import { clientFetch } from './client-api';
import { Project, ApiResponse } from '@/types';

export const getProjects = async (params?: Record<string, string | number | boolean | undefined>) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return await clientFetch<ApiResponse<Project[]>>(`/projects${query}`);
};

export const getProjectById = async (id: string) => {
  return await clientFetch<ApiResponse<Project>>(`/projects/${id}`);
};
