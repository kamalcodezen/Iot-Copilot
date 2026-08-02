import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { generalRateLimit } from './middlewares/rateLimit';
import { getAuth, getAuthHandler } from "./config/auth";
import { fromNodeHeaders } from 'better-auth/node';
import { getDBStatus } from './config/db';
import { logger } from './utils/logger';

import userRoutes from './routes/user';
import projectRoutes from './routes/project';
import aiRoutes from './routes/ai';
import learningPathRoutes from './routes/learningPath';
import activityRoutes from './routes/activity';
import communityRoutes from './routes/community';
import adminRoutes from './routes/admin';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(generalRateLimit);

app.get('/health', (_req: Request, res: Response) => {
  const db = getDBStatus();
  res.json({
    success: true,
    data: {
      status: db.isConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: db,
      uptime: process.uptime(),
    },
  });
});

const betterAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const handler = getAuthHandler();
    await handler(req, res);
    if (!res.headersSent) {
      next();
    }
  } catch (err) {
    logger.error('Better Auth middlewares error:', err);
    next(err);
  }
};

app.use((req: Request, res: Response, next: NextFunction) => {
  const reqStart = Date.now();
  const traceId = Math.random().toString(36).substring(7);
  (req as any).traceId = traceId;
  console.log(`[${reqStart}] [Backend] Express middleware start [${traceId}] ${req.method} ${req.url}`);
  
  const originalJson = res.json;
  res.json = function (body) {
    console.log(`[${Date.now()}] [Backend] Response (json) sent [${traceId}] ${req.method} ${req.url}`);
    return originalJson.call(this, body);
  };
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

app.all('/api/auth/me', async (req: Request, res: Response) => {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    res.json({ success: true, data: session.user });
  } catch {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

app.use('/api/auth', betterAuthMiddleware);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorHandler);

export default app;
