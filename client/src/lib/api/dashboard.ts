import { clientFetch } from './client-api';
import { Activity, ApiResponse, StatsData } from '@/types';

export const getDashboardStats = async () => {
  return await clientFetch<ApiResponse<StatsData>>('/activities/stats');
};

export const getActivities = async (params?: Record<string, string | number | boolean | undefined>) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return await clientFetch<ApiResponse<Activity[]>>(`/activities${query}`);
};
