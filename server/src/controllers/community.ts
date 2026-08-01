import { Response } from 'express';
import type { FilterQuery } from 'mongoose';
import Project, { IProject } from '../models/Project';
import Comment from '../models/Comment';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireUser } from '../utils/request';
import { sendData, sendPaginated } from '../utils/response';
import { PublicUser, getPublicUserById, getPublicUsersByIds } from '../services/user';
import { mongoIdParams } from '../validators/shared';
import { communityQuerySchema } from '../validators/community';

const ANONYMOUS_AUTHOR = { name: 'Anonymous', avatar: '' };

// Replaces the project's userId with the author's public profile so the
// community pages can render names and avatars without exposing emails.
async function attachUsers(projects: IProject[]) {
  const users = await getPublicUsersByIds(projects.map((p) => p.userId));
  const userMap = new Map(users.map((u) => [u.id, u]));

  return projects.map((project) => ({
    ...project.toObject(),
    userId: (userMap.get(project.userId) || ANONYMOUS_AUTHOR) as PublicUser,
  }));
}

// Enriched comment: the raw comment with the author's public profile in place
// of the author id.
async function attachUserToComment(comment: InstanceType<typeof Comment>) {
  const user = await getPublicUserById(comment.userId);
  return {
    ...comment.toObject(),
    userId: (user || ANONYMOUS_AUTHOR) as PublicUser,
  };
}

export const getPublicProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, search, category, difficulty, sort } = communityQuerySchema.parse(req.query);

  const query: FilterQuery<IProject> = { isPublic: true };
  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  const projects = await Project.find(query)
    .sort(sort || '-likes')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Project.countDocuments(query);
  const enriched = await attachUsers(projects);

  sendPaginated(res, enriched, page, limit, total);
});

export const getPublicProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = mongoIdParams.parse(req.params);
  const project = await Project.findById(id);
  if (!project || !project.isPublic) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  const user = await getPublicUserById(project.userId);
  sendData(res, {
    ...project.toObject(),
    userId: (user || ANONYMOUS_AUTHOR) as PublicUser,
  });
});

export const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const project = await Project.findById(id);
  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  const comment = await Comment.create({
    userId,
    projectId: id,
    content: req.body.content,
  });

  const enriched = await attachUserToComment(comment);
  sendData(res, enriched, 201);
});

export const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = mongoIdParams.parse(req.params);
  const comments = await Comment.find({ projectId: id }).sort({ createdAt: -1 });

  const enriched = await Promise.all(comments.map(attachUserToComment));
  sendData(res, enriched);
});
