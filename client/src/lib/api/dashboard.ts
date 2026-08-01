"use server";

import { protectedFetch } from '../core/server';
import { Activity, ApiResponse, StatsData } from '@/types';

export const getDashboardStats = async () => {
  return await protectedFetch<ApiResponse<StatsData>>('/activities/stats');
};

export const getActivities = async (params?: Record<string, string | number | boolean | undefined>) => {
  return await protectedFetch<ApiResponse<Activity[]>>('/activities', { params });
};
