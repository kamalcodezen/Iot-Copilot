'use server';

import { serverMutation } from '../core/server';
import { ApiResponse, CommunityComment } from '@/types';
import { revalidatePath } from 'next/cache';

export const addCommentAction = async (projectId: string, content: string) => {
  const result = await serverMutation<ApiResponse<CommunityComment>>(
    `/community/projects/${projectId}/comments`,
    { content },
    'POST'
  );
  revalidatePath(`/community/${projectId}`);
  return result;
};
