"use server";

import { serverFetch } from '../core/server';
import { Project, ApiResponse } from '@/types';

export const getProjects = async (params?: Record<string, string | number | boolean | undefined>) => {
  return await serverFetch<ApiResponse<Project[]>>('/projects', { params });
};

export const getProjectById = async (id: string) => {
  return await serverFetch<ApiResponse<Project>>(`/projects/${id}`);
};
