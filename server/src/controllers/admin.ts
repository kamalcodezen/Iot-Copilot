import { Response } from 'express';
import Project from '../models/Project';
import Activity from '../models/Activity';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { sendData, sendMessage, sendPaginated } from '../utils/response';
import { mongoIdParams, paginationSchema } from '../validators/shared';
import { getAuth } from '../config/auth';
import { fromNodeHeaders } from 'better-auth/node';
import {
  getUserById,
  findUsers,
  countUsers,
  updateUserRoleById,
} from '../services/user';

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, search } = paginationSchema.parse(req.query);

  const { users, total } = await findUsers(search, page, limit);

  sendPaginated(res, users, page, limit, total);
});

export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = mongoIdParams.parse(req.params);
  const { role } = req.body;

  const updated = await updateUserRoleById(id, role);
  if (!updated) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  sendData(res, updated);
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = mongoIdParams.parse(req.params);
  const existing = await getUserById(id);
  if (!existing) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  // Better Auth removes the user and all of their sessions and accounts.
  const auth = getAuth();
  await auth.api.removeUser({
    body: { userId: id },
    headers: fromNodeHeaders(req.headers),
  });

  // Remove everything the deleted user owned.
  await Project.deleteMany({ userId: id });
  await Activity.deleteMany({ userId: id });

  sendMessage(res, 'User deleted');
});

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const totalUsers = await countUsers();
  const totalProjects = await Project.countDocuments();
  const totalPublicProjects = await Project.countDocuments({ isPublic: true });
  const totalCompletedProjects = await Project.countDocuments({ status: 'completed' });

  const { users: recentUsers } = await findUsers(undefined, 1, 5);

  const projectsByCategory = await Project.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  sendData(res, {
    totals: { totalUsers, totalProjects, totalPublicProjects, totalCompletedProjects },
    recentUsers,
    projectsByCategory,
  });
});
