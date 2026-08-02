"use server";

import { serverFetch } from '../core/server';
import { Activity, ApiResponse, StatsData } from '@/types';

export const getDashboardStats = async () => {
  return await serverFetch<ApiResponse<StatsData>>('/activities/stats');
};

export const getActivities = async (params?: Record<string, string | number | boolean | undefined>) => {
  return await serverFetch<ApiResponse<Activity[]>>('/activities', { params });
};
