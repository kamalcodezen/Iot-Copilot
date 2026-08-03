import { clientFetch } from './client-api';
import { AdminStats, AdminUser, ApiResponse } from '@/types';

export const getAdminUsers = async (params?: Record<string, string | number | boolean | undefined>) => {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return await clientFetch<ApiResponse<AdminUser[]>>(`/admin/users${query}`);
};

export const getAdminStats = async () => {
  return await clientFetch<ApiResponse<AdminStats>>('/admin/stats');
};
