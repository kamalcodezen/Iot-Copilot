import { Response } from 'express';
import LearningPath from '../models/LearningPath';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';

export const getLearningPaths = asyncHandler(async (req: AuthRequest, res: Response) => {
    const paths = await LearningPath.find({ userId: req.user!.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: paths });
});

export const getLearningPath = asyncHandler(async (req: AuthRequest, res: Response) => {
    const path = await LearningPath.findById(req.params.id);

    if (!path) {
      res.status(404).json({ success: false, message: 'Learning path not found' });
      return;
    }

    if (path.userId.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    res.json({ success: true, data: path });
});

export const updateLearningPath = asyncHandler(async (req: AuthRequest, res: Response) => {
    const path = await LearningPath.findById(req.params.id);

    if (!path) {
      res.status(404).json({ success: false, message: 'Learning path not found' });
      return;
    }

    if (path.userId.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    if (req.body.modules) {
      const completed = req.body.modules.filter((m: any) => m.status === 'completed').length;
      req.body.progress = Math.round((completed / req.body.modules.length) * 100);

      if (req.body.progress === 100) {
        req.body.completedAt = new Date();
        req.body.isActive = false;
      }
    }

    const updated = await LearningPath.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ success: true, data: updated });
});

export const deleteLearningPath = asyncHandler(async (req: AuthRequest, res: Response) => {
    const path = await LearningPath.findById(req.params.id);

    if (!path) {
      res.status(404).json({ success: false, message: 'Learning path not found' });
      return;
    }

    if (path.userId.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    await LearningPath.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Learning path deleted' });
});
