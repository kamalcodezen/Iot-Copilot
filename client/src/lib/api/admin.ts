"use server";

import { protectedFetch } from '../core/server';
import { ApiResponse } from '@/types';

export const getAdminUsers = async (params?: Record<string, string | number | boolean | undefined>) => {
  return await protectedFetch('/admin/users', { params }) as any;
};

export const getAdminStats = async () => {
  return await protectedFetch('/admin/stats') as ApiResponse<any>;
};
