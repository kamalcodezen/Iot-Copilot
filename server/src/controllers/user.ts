import { Response } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireUser } from '../utils/request';
import {
  getUserById,
  updateUserProfile,
  setUserAvatar,
  getUserBadges as getUserBadgesById,
} from '../services/user';
import { uploadImage } from '../services/cloudinary';
import { mongoIdParams, paginationSchema } from '../validators';

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = mongoIdParams.parse(req.params);
  const user = await getUserById(id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId, role } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  if (userId !== id && role !== 'admin') {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  const updated = await updateUserProfile(id, req.body);
  res.json({ success: true, data: updated });
});

export const uploadAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId, role } = requireUser(req);
  const { id } = mongoIdParams.parse(req.params);
  if (userId !== id && role !== 'admin') {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }

  const url = await uploadImage(req.file);
  const updated = await setUserAvatar(id, url);
  res.json({ success: true, data: updated });
});

export const getUserProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = mongoIdParams.parse(req.params);
  const { page, limit } = paginationSchema.parse(req.query);

  const projects = await Project.find({ userId: id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Project.countDocuments({ userId: id });

  res.json({
    success: true,
    data: projects,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getUserBadges = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = mongoIdParams.parse(req.params);
  const badges = await getUserBadgesById(id);
  res.json({ success: true, data: badges });
});
