"use server";

import { protectedFetch } from '../core/server';
import { Project, ApiResponse } from '@/types';

export const getProjects = async (params?: Record<string, string | number | boolean | undefined>) => {
  return await protectedFetch('/projects', { params }) as ApiResponse<Project[]>;
};

export const getProjectById = async (id: string) => {
  return await protectedFetch(`/projects/${id}`) as ApiResponse<Project>;
};
