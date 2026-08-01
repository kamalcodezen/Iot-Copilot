'use server';

import { serverMutation } from '../core/server';
import { AdminUser, ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export const updateUserRoleAction = async (id: string, role: string) => {
  const result = await serverMutation<ApiResponse<AdminUser>>(`/admin/users/${id}/role`, { role }, 'PATCH');
  revalidatePath('/admin/users');
  return result;
};

export const deleteUserAction = async (id: string) => {
  const result = await serverMutation<ApiResponse<unknown>>(`/admin/users/${id}`, undefined, 'DELETE');
  revalidatePath('/admin/users');
  return result;
};
