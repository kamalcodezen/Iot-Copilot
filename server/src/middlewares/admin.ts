import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin access required' });
    return;
  }
  next();
};
