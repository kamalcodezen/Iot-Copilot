import { Response } from 'express';
import LearningPath from '../models/LearningPath';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireUser } from '../utils/request';
import { sendData, sendMessage } from '../utils/response';
import { mongoIdParams } from '../validators/shared';

// Fetches a learning path owned by the requesting user. Responds 404/403 with
// the standard messages and returns null so the handler can stop early.
async function findOwnedPath(userId: string, id: string, res: Response) {
  const path = await LearningPath.findById(id);

  if (!path) {
    res.status(404).json({ success: false, message: 'Learning path not found' });
    return null;
  }

  if (path.userId !== userId) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return null;
  }

  return path;
}

export const getLearningPaths = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const paths = await LearningPath.find({ userId }).sort({ createdAt: -1 });

  sendData(res, paths);
});

export const getLearningPath = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const path = await findOwnedPath(userId, id, res);
  if (!path) return;

  sendData(res, path);
});

export const updateLearningPath = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const path = await findOwnedPath(userId, id, res);
  if (!path) return;

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
  sendData(res, updated);
});

export const deleteLearningPath = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  const path = await findOwnedPath(userId, id, res);
  if (!path) return;

  await LearningPath.findByIdAndDelete(id);
  sendMessage(res, 'Learning path deleted');
});
