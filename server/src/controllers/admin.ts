import { Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project';
import Activity from '../models/Activity';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';

const userCollection = () => mongoose.connection.db?.collection('user');

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const col = userCollection();
    if (!col) {
      res.status(500).json({ success: false, message: 'Database not connected' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const query: any = {};
    if (search) query.name = { $regex: search, $options: 'i' };

    const users = await col.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await col.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});

export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    const col = userCollection();
    if (!col) {
      res.status(500).json({ success: false, message: 'Database not connected' });
      return;
    }

    const { role } = req.body;
    const result = await col.findOneAndUpdate(
      { id: req.params.id },
      { $set: { role } },
      { returnDocument: 'after' }
    );

    if (!result) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: result });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const col = userCollection();
    if (!col) {
      res.status(500).json({ success: false, message: 'Database not connected' });
      return;
    }

    const existing = await col.findOne({ id: req.params.id });
    if (!existing) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    await col.deleteOne({ id: req.params.id });
    await Project.deleteMany({ userId: req.params.id });
    await Activity.deleteMany({ userId: req.params.id });

    const sessionCol = mongoose.connection.db?.collection('session');
    const accountCol = mongoose.connection.db?.collection('account');
    if (sessionCol) await sessionCol.deleteMany({ userId: req.params.id });
    if (accountCol) await accountCol.deleteMany({ userId: req.params.id });

    res.json({ success: true, message: 'User deleted' });
});

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const col = userCollection();
    const totalUsers = col ? await col.countDocuments() : 0;
    const totalProjects = await Project.countDocuments();
    const totalPublicProjects = await Project.countDocuments({ isPublic: true });
    const totalCompletedProjects = await Project.countDocuments({ status: 'completed' });

    const recentUsers = col
      ? await col.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray()
      : [];

    const projectsByCategory = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totals: { totalUsers, totalProjects, totalPublicProjects, totalCompletedProjects },
        recentUsers,
        projectsByCategory,
      },
    });
});
