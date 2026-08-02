"use server";

import { serverFetch } from '../core/server';
import { AdminStats, AdminUser, ApiResponse } from '@/types';

export const getAdminUsers = async (params?: Record<string, string | number | boolean | undefined>) => {
  return await serverFetch<ApiResponse<AdminUser[]>>('/admin/users', { params });
};

export const getAdminStats = async () => {
  return await serverFetch<ApiResponse<AdminStats>>('/admin/stats');
};
