import { Response } from 'express';
import LearningPath from '../models/LearningPath';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireUser } from '../utils/request';
import { mongoIdParams } from '../validators';

export const getLearningPaths = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const paths = await LearningPath.find({ userId }).sort({ createdAt: -1 });

  res.json({ success: true, data: paths });
});

export const getLearningPath = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const path = await LearningPath.findById(id);

  if (!path) {
    res.status(404).json({ success: false, message: 'Learning path not found' });
    return;
  }

  if (path.userId !== userId) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  res.json({ success: true, data: path });
});

export const updateLearningPath = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const path = await LearningPath.findById(id);

  if (!path) {
    res.status(404).json({ success: false, message: 'Learning path not found' });
    return;
  }

  if (path.userId !== userId) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { modules } = req.body as { modules?: Array<{ status?: string }> };
  const updates = { ...req.body };

  if (modules && modules.length > 0) {
    const completed = modules.filter((m) => m.status === 'completed').length;
    updates.progress = Math.round((completed / modules.length) * 100);

    if (updates.progress === 100) {
      updates.completedAt = new Date();
      updates.isActive = false;
    }
  }

  const updated = await LearningPath.findByIdAndUpdate(id, updates, { new: true });
  res.json({ success: true, data: updated });
});

export const deleteLearningPath = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const path = await LearningPath.findById(id);

  if (!path) {
    res.status(404).json({ success: false, message: 'Learning path not found' });
    return;
  }

  if (path.userId !== userId) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  await LearningPath.findByIdAndDelete(id);
  res.json({ success: true, message: 'Learning path deleted' });
});
