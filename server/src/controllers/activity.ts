import { Response } from 'express';
import Activity from '../models/Activity';
import Project from '../models/Project';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireUser } from '../utils/request';
import { getUserById } from '../services/user';
import { paginationSchema } from '../validators';

export const getActivities = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { page, limit } = paginationSchema.parse(req.query);

  const activities = await Activity.find({ userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Activity.countDocuments({ userId });

  res.json({
    success: true,
    data: activities,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);

  const user = await getUserById(userId);
  const totalProjects = await Project.countDocuments({ userId });
  const completedProjects = await Project.countDocuments({ userId, status: 'completed' });
  const inProgressProjects = await Project.countDocuments({ userId, status: 'in-progress' });

  // One data point per day for the last 30 days, used for the activity chart.
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const dailyActivity = await Activity.aggregate<{ _id: string; count: number }>([
    {
      $match: {
        userId,
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
