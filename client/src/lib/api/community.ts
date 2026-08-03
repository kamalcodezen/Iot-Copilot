import { clientFetch } from './client-api';
import { ApiResponse, CommunityComment, PopulatedProject } from '@/types';

export const getCommunityProjects = async (params?: Record<string, string | number | boolean | undefined>) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return await clientFetch<ApiResponse<PopulatedProject[]>>(`/community/projects${query}`);
};

export const getCommunityProject = async (id: string) => {
  return await clientFetch<ApiResponse<PopulatedProject>>(`/community/projects/${id}`);
};

export const getComments = async (projectId: string) => {
  return await clientFetch<ApiResponse<CommunityComment[]>>(`/community/projects/${projectId}/comments`);
};
