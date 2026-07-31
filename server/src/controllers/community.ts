import { Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project';
import Comment from '../models/Comment';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';

function userCollection() {
  return mongoose.connection.db?.collection('user');
}

async function attachUsers(projects: any[]) {
  const col = userCollection();
  if (!col) return projects;
  const userIds = [...new Set(projects.map((p: any) => p.userId))];
  const users = await col.find({ id: { $in: userIds } }).project({ id: 1, name: 1, avatar: 1, _id: 0 }).toArray();
  const userMap = new Map(users.map((u: any) => [u.id, u]));
  return projects.map((p: any) => ({
    ...p.toObject(),
    userId: userMap.get(p.userId) || { name: 'Anonymous', avatar: '' },
  }));
}

async function attachUserToComment(comment: any) {
  const col = userCollection();
  if (!col) return comment;
  const user = await col.findOne({ id: comment.userId }, { projection: { name: 1, avatar: 1, bio: 1 } });
  return {
    ...comment.toObject(),
    userId: user || { name: 'Anonymous', avatar: '' },
  };
}

export const getPublicProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;
    const sort = req.query.sort as string || '-likes';

    const query: any = { isPublic: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const projects = await Project.find(query)
      .sort(sort)
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
    const col = userCollection();
    const project = await Project.findById(req.params.id);

    if (!project || !project.isPublic) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const user = col ? await col.findOne({ id: project.userId }, { projection: { name: 1, avatar: 1, bio: 1 } }) : null;
    const data = { ...project.toObject(), userId: user || { name: 'Anonymous', avatar: '' } };

    res.json({ success: true, data });
});

export const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const comment = await Comment.create({
      userId: req.user!.id,
      projectId: req.params.id,
      content: req.body.content,
    });

    const enriched = await attachUserToComment(comment);

    res.status(201).json({ success: true, data: enriched });
});

export const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const comments = await Comment.find({ projectId: req.params.id })
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(comments.map(attachUserToComment));

    res.json({ success: true, data: enriched });
});
