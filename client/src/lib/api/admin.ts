"use server";

import { protectedFetch } from '../core/server';
import { AdminStats, AdminUser, ApiResponse } from '@/types';

export const getAdminUsers = async (params?: Record<string, string | number | boolean | undefined>) => {
  return await protectedFetch<ApiResponse<AdminUser[]>>('/admin/users', { params });
};

export const getAdminStats = async () => {
  return await protectedFetch<ApiResponse<AdminStats>>('/admin/stats');
};
