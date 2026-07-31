'use server';

import { serverMutation } from '../core/server';
import { revalidatePath } from 'next/cache';

export const updateUserRoleAction = async (id: string, role: string) => {
  const result = await serverMutation(`/admin/users/${id}/role`, { role }, 'PATCH');
  revalidatePath('/admin/users');
  return result;
};

export const deleteUserAction = async (id: string) => {
  const result = await serverMutation(`/admin/users/${id}`, undefined, 'DELETE');
  revalidatePath('/admin/users');
  return result;
};
