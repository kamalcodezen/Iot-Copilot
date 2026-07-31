'use server';

import { serverMutation } from '../core/server';
import { revalidatePath } from 'next/cache';

export const addCommentAction = async (projectId: string, content: string) => {
  const result = await serverMutation(`/community/projects/${projectId}/comments`, { content }, 'POST');
  revalidatePath(`/community/${projectId}`);
  return result;
};
