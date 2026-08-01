"use server";

import { protectedFetch } from '../core/server';
import { User, ApiResponse } from '@/types';

export const getProfile = async (id: string) => {
  return await protectedFetch<ApiResponse<User>>(`/users/${id}`);
};

export const getBadges = async (id: string) => {
  return await protectedFetch<ApiResponse<string[]>>(`/users/${id}/badges`);
};
