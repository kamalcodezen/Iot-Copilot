import { Response } from 'express';
import type { FilterQuery } from 'mongoose';
import Project, { IProject } from '../models/Project';
import Activity from '../models/Activity';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireUser } from '../utils/request';
import { sendData, sendMessage, sendPaginated } from '../utils/response';
import { markUserActive, addUserStat } from '../services/user';
import { mongoIdParams } from '../validators/shared';
import { projectQuerySchema } from '../validators/project';

// Fetches a project the requesting user may read: their own project, or any
// public one. Responds 404/403 with the standard messages and returns null so
// the handler can stop early.
async function findAccessibleProject(userId: string, id: string, res: Response): Promise<IProject | null> {
  const project = await Project.findById(id);

  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return null;
  }

  if (project.userId !== userId && !project.isPublic) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return null;
  }

  return project;
}

// Same contract as `findAccessibleProject`, but only for projects the
// requesting user owns.
async function findOwnedProject(userId: string, id: string, res: Response): Promise<IProject | null> {
  const project = await Project.findById(id);

  if (!project) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return null;
  }

  if (project.userId !== userId) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return null;
  }

  return project;
}

export const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { page, limit, search, status, category, difficulty } = projectQuerySchema.parse(req.query);

  const query: FilterQuery<IProject> = { userId };
  if (search) query.$text = { $search: search };
  if (status) query.status = status;
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  // Find and count are independent, so run them at the same time
  // instead of waiting for one to finish before starting the other.
  const [projects, total] = await Promise.all([
    Project.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec(),
    Project.countDocuments(query),
  ]);

  sendPaginated(res, projects, page, limit, total);
});

export const getProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const project = await findAccessibleProject(userId, id, res);
  if (!project) return;

  sendData(res, project);
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

  sendData(res, project, 201);
});

export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const project = await findOwnedProject(userId, id, res);
  if (!project) return;

  const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
  sendData(res, updated);
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
  sendMessage(res, 'Project deleted');
});

export const updateProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const project = await findOwnedProject(userId, id, res);
  if (!project) return;

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
  sendData(res, project);
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

  sendData(res, { likes: project.likes });
});
