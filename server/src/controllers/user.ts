import { Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project';
import { AuthRequest } from '../types';
import { uploadImage } from '../services/cloudinary';
import { asyncHandler } from '../middlewares/asyncHandler';

const userCollection = () => mongoose.connection.db?.collection('user');

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const col = userCollection();
  if (!col) return res.status(500).json({ success: false, message: 'Database not connected' });

  const user = await col.findOne({ id: req.params.id });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user?.id !== req.params.id && req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const { name, bio, skillLevel, socialLinks, preferences } = req.body;
  const col = userCollection();
  if (!col) return res.status(500).json({ success: false, message: 'Database not connected' });

  const update: Record<string, any> = {};
  if (name !== undefined) update.name = name;
  if (bio !== undefined) update.bio = bio;
  if (skillLevel !== undefined) update.skillLevel = skillLevel;
  if (socialLinks !== undefined) update.socialLinks = JSON.stringify(socialLinks);
  if (preferences !== undefined) update.preferences = JSON.stringify(preferences);

  await col.updateOne({ id: req.params.id }, { $set: update });
  const updated = await col.findOne({ id: req.params.id });

  res.json({ success: true, data: updated });
});

export const uploadAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const url = await uploadImage(req.file);
  const col = userCollection();
  if (!col) return res.status(500).json({ success: false, message: 'Database not connected' });

  await col.updateOne({ id: req.params.id }, { $set: { image: url } });
  const updated = await col.findOne({ id: req.params.id });

  res.json({ success: true, data: updated });
});

export const getUserProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const projects = await Project.find({ userId: req.params.id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Project.countDocuments({ userId: req.params.id });

  res.json({
    success: true,
    data: projects,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getUserBadges = asyncHandler(async (req: AuthRequest, res: Response) => {
  const col = userCollection();
  if (!col) return res.json({ success: true, data: [] });
  
  const user = await col.findOne({ id: req.params.id });
  res.json({ success: true, data: user?.badges || [] });
});
