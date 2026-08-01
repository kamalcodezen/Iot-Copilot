import { Response } from 'express';
import type { FilterQuery } from 'mongoose';
import Project, { IProject } from '../models/Project';
import Comment from '../models/Comment';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireUser } from '../utils/request';
import { getPublicUserById, getPublicUsersByIds } from '../services/user';
import { mongoIdParams, communityQuerySchema } from '../validators';

interface PublicUserInfo {
  name: string;
  avatar: string;
}

// Replaces the project's userId with the author's public profile so the
// community pages can render names and avatars without exposing emails.
async function attachUsers(projects: IProject[]) {
  const users = await getPublicUsersByIds(projects.map((p) => p.userId));
  const userMap = new Map(users.map((u) => [u.id, u]));

  return projects.map((project) => ({
    ...project.toObject(),
    userId: userMap.get(project.userId) || { name: 'Anonymous', avatar: '' },
  }));
}

async function attachUserToComment(comment: InstanceType<typeof Comment>) {
  const user = await getPublicUserById(comment.userId);
  return {
    ...comment.toObject(),
    userId: (user || { name: 'Anonymous', avatar: '' }) as PublicUserInfo,
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

  res.json({
    success: true,
    data: enriched,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getPublicProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = mongoIdParams.parse(req.params);
  const project = await Project.findById(id);
  if (!project || !project.isPublic) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  const user = await getPublicUserById(project.userId);
  const data = {
    ...project.toObject(),
    userId: (user || { name: 'Anonymous', avatar: '' }) as PublicUserInfo,
  };

  res.json({ success: true, data });
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
  res.status(201).json({ success: true, data: enriched });
});

export const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = mongoIdParams.parse(req.params);
  const comments = await Comment.find({ projectId: id }).sort({ createdAt: -1 });

  const enriched = await Promise.all(comments.map(attachUserToComment));
  res.json({ success: true, data: enriched });
});
