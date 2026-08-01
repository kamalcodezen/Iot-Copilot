import { Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project';
import Activity from '../models/Activity';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { sendData, sendMessage, sendPaginated } from '../utils/response';
import { mongoIdParams, paginationSchema } from '../validators/shared';
import {
  getUserById,
  findUsers,
  countUsers,
  updateUserRoleById,
  deleteUserById,
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

  await deleteUserById(id);

  // Remove everything the deleted user owned, including better-auth's
  // session and account records for that user.
  await Project.deleteMany({ userId: id });
  await Activity.deleteMany({ userId: id });
  await mongoose.connection.db?.collection('session').deleteMany({ userId: id });
  await mongoose.connection.db?.collection('account').deleteMany({ userId: id });

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
