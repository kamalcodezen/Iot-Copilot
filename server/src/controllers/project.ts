import { Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project';
import Activity from '../models/Activity';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';

export const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;

    const query: any = { userId: req.user!.id };

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
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    if (project.userId.toString() !== req.user!.id && !project.isPublic) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    res.json({ success: true, data: project });
});

export const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await Project.create({
      ...req.body,
      userId: req.user!.id,
    });

    await mongoose.connection.db?.collection('user').updateOne(
      { id: req.user!.id },
      { $inc: { totalProjects: 1 }, $set: { lastActive: new Date() } }
    );

    await Activity.create({
      userId: req.user!.id,
      type: 'project_created',
      description: `Created project: ${project.title}`,
      metadata: { projectId: project._id },
    });

    res.status(201).json({ success: true, data: project });
});

export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    if (project.userId.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ success: true, data: updated });
});

export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    if (project.userId.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Project deleted' });
});

export const updateProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { progress } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    if (project.userId.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    project.progress = progress;
    if (progress === 100) {
      project.status = 'completed';
      await mongoose.connection.db?.collection('user').updateOne(
        { id: req.user!.id },
        { $inc: { completedProjects: 1 } }
      );
      await Activity.create({
        userId: req.user!.id,
        type: 'project_completed',
        description: `Completed project: ${project.title}`,
        metadata: { projectId: project._id },
      });
    }

    await project.save();
    res.json({ success: true, data: project });
});

export const toggleLike = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    project.likes += 1;
    await project.save();

    res.json({ success: true, data: { likes: project.likes } });
});
