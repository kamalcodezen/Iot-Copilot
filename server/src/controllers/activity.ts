import { Response } from 'express';
import mongoose from 'mongoose';
import Activity from '../models/Activity';
import Project from '../models/Project';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';

export const getActivities = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const activities = await Activity.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Activity.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      data: activities,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const userCol = mongoose.connection.db?.collection('user');
    const user = userCol ? await userCol.findOne({ id: req.user.id }) : null;
    const totalProjects = await Project.countDocuments({ userId: req.user.id });
    const completedProjects = await Project.countDocuments({ userId: req.user.id, status: 'completed' });
    const inProgressProjects = await Project.countDocuments({ userId: req.user.id, status: 'in-progress' });

    // Calculate 30-day activity for chart
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyActivity = await Activity.aggregate([
      {
        $match: {
          userId: req.user.id,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        stats: user?.stats || {},
        totals: { totalProjects, completedProjects, inProgressProjects },
        dailyActivity: dailyActivity.map((d) => ({ date: d._id, count: d.count })),
      },
    });
});
