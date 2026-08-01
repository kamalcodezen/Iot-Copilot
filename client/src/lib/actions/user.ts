'use server';

import { serverMutation } from '../core/server';
import { User, ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';

export const updateProfileAction = async (id: string, data: Partial<User>) => {
  const result = await serverMutation<ApiResponse<User>>(`/users/${id}`, data, 'PUT');
  revalidatePath(`/profile/${id}`);
  revalidatePath('/profile');
  return result;
};

export const uploadAvatarAction = async (id: string, formData: FormData) => {
  const result = await serverMutation<ApiResponse<User>>(`/users/${id}/avatar`, formData, 'PUT');
  revalidatePath(`/profile/${id}`);
  revalidatePath('/profile');
  return result;
};
