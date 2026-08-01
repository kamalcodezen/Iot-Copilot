import { Response } from 'express';
import Activity from '../models/Activity';
import Project from '../models/Project';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireUser } from '../utils/request';
import { sendData, sendPaginated } from '../utils/response';
import { getUserById } from '../services/user';
import { paginationSchema } from '../validators/shared';

export const getActivities = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { page, limit } = paginationSchema.parse(req.query);

  // Find and count are independent, so run them at the same time
  // instead of waiting for one to finish before starting the other.
  const [activities, total] = await Promise.all([
    Activity.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec(),
    Activity.countDocuments({ userId }),
  ]);

  sendPaginated(res, activities, page, limit, total);
});

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);

  // All of these queries are independent, so run them at the same time
  // instead of one after another.
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [user, totalProjects, completedProjects, inProgressProjects, dailyActivity] = await Promise.all([
    getUserById(userId),
    Project.countDocuments({ userId }),
    Project.countDocuments({ userId, status: 'completed' }),
    Project.countDocuments({ userId, status: 'in-progress' }),
    Activity.aggregate<{ _id: string; count: number }>([
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
    ]).exec(),
  ]);

  const totals = { totalProjects, completedProjects, inProgressProjects };

  // Stats are stored as plain fields on the user document (better-auth has no
  // nested profile object), so gather them into the shape the dashboard uses.
  const stats = {
    totalProjects: user?.totalProjects ?? totals.totalProjects,
    completedProjects: user?.completedProjects ?? totals.completedProjects,
    learningStreak: user?.learningStreak ?? 0,
    totalSessions: user?.totalSessions ?? 0,
    totalHours: user?.totalHours ?? 0,
    lastActive: user?.lastActive ?? '',
  };

  sendData(res, {
    stats,
    totals,
    dailyActivity: dailyActivity.map((d) => ({ date: d._id, count: d.count })),
  });
});
