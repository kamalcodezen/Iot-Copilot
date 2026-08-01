"use server";

import { serverFetch } from '../core/server';
import { ApiResponse, CommunityComment, PopulatedProject } from '@/types';

export const getCommunityProjects = async (params?: Record<string, string | number | boolean | undefined>) => {
  return await serverFetch<ApiResponse<PopulatedProject[]>>('/community/projects', { params });
};

export const getCommunityProject = async (id: string) => {
  return await serverFetch<ApiResponse<PopulatedProject>>(`/community/projects/${id}`);
};

export const getComments = async (projectId: string) => {
  return await serverFetch<ApiResponse<CommunityComment[]>>(`/community/projects/${projectId}/comments`);
};
