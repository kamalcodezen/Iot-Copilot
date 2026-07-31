"use server";

import { protectedFetch } from '../core/server';
import { User, ApiResponse } from '@/types';

export const getProfile = async (id: string) => {
  return await protectedFetch(`/users/${id}`) as ApiResponse<User>;
};

export const getBadges = async (id: string) => {
  return await protectedFetch(`/users/${id}/badges`) as any;
};
