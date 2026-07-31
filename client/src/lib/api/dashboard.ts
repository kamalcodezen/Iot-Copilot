"use server";

import { protectedFetch } from '../core/server';
import { ApiResponse } from '@/types';

export const getDashboardStats = async () => {
  return await protectedFetch('/activities/stats') as ApiResponse<any>;
};

export const getActivities = async (params?: Record<string, string | number | boolean | undefined>) => {
  return await protectedFetch('/activities', { params }) as any;
};
