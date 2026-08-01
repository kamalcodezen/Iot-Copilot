import { Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from '../config/auth';
import { AuthRequest } from '../types';

// Reads the session cookie from the request headers. Returns the user when
// a valid session exists, or null when the visitor is not logged in.
async function getSessionUser(req: AuthRequest) {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user ?? null;
}

// Converts better-auth's user object to the compact shape used by the rest
// of the app, normalizing the custom `role` field to 'user' | 'admin'.
function toAppUser(user: { id: string; role?: string | null }): { id: string; role: 'user' | 'admin' } {
  return {
    id: user.id,
    role: user.role === 'admin' ? 'admin' : 'user',
  };
}

// Protects a route: rejects the request with 401 when there is no session.
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    req.user = toAppUser(user);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
};

// Same as authenticate, but lets the request through when there is no session
// (used for endpoints that behave differently for logged-in visitors).
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await getSessionUser(req);
    if (user) {
      req.user = toAppUser(user);
    }
  } catch {
    // No session and no user attached: the route simply behaves as public.
  }
  next();
};
