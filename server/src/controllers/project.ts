import { Response } from 'express';
import type { FilterQuery } from 'mongoose';
import Project, { IProject } from '../models/Project';
import Activity from '../models/Activity';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireUser } from '../utils/request';
import { markUserActive, addUserStat } from '../services/user';
import { mongoIdParams, projectQuerySchema } from '../validators';

export const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { page, limit, search, status, category, difficulty } = projectQuerySchema.parse(req.query);

  const query: FilterQuery<IProject> = { userId };
  if (search) query.$text = { $search: search };
  if (status) query.status = status;
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  const projects = await Project.find(query)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Project.countDocuments(query);

  res.json({
    success: true,
    data: projects,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const project = await Project.findById(id);

  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  if (project.userId !== userId && !project.isPublic) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  res.json({ success: true, data: project });
});

export const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);

  const project = await Project.create({
    ...req.body,
    userId,
  });

  await markUserActive(userId);
  await addUserStat(userId, 'totalProjects', 1);
  await Activity.create({
    userId,
    type: 'project_created',
    description: `Created project: ${project.title}`,
    metadata: { projectId: project._id },
  });

  res.status(201).json({ success: true, data: project });
});

export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const project = await Project.findById(id);

  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  if (project.userId !== userId) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ success: true, data: updated });
});

export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const project = await Project.findById(id);

  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  if (project.userId !== user.id && user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  await Project.findByIdAndDelete(id);
  res.json({ success: true, message: 'Project deleted' });
});

export const updateProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const project = await Project.findById(id);

  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  if (project.userId !== userId) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  const progress = req.body.progress as number;
  project.progress = progress;
  if (progress === 100) {
    project.status = 'completed';
    await addUserStat(userId, 'completedProjects', 1);
    await Activity.create({
      userId,
      type: 'project_completed',
      description: `Completed project: ${project.title}`,
      metadata: { projectId: project._id },
    });
  }

  await project.save();
  res.json({ success: true, data: project });
});

export const toggleLike = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = mongoIdParams.parse(req.params);
  const project = await Project.findById(id);
  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  project.likes += 1;
  await project.save();

  res.json({ success: true, data: { likes: project.likes } });
});
