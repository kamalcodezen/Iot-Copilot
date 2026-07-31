import { Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from "../config/auth";
import { AuthRequest } from '../types';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    req.user = {
      id: session.user.id,
      role: (session.user as any).role === 'admin' ? 'admin' : 'user',
    };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (session) {
      req.user = {
        id: session.user.id,
        role: (session.user as any).role === 'admin' ? 'admin' : 'user',
      };
    }
  } catch {}
  next();
};
