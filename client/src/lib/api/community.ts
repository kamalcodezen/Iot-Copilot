"use server";

import { serverFetch } from '../core/server';
import { PopulatedProject, ApiResponse } from '@/types';

export const getCommunityProjects = async (params?: Record<string, string | number | boolean | undefined>) => {
  return await serverFetch('/community/projects', { params }) as ApiResponse<PopulatedProject[]>;
};

export const getCommunityProject = async (id: string) => {
  return await serverFetch(`/community/projects/${id}`) as ApiResponse<PopulatedProject>;
};

export const getComments = async (projectId: string) => {
  return await serverFetch(`/community/projects/${projectId}/comments`) as any;
};
