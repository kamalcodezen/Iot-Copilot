import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: [err.details] } : {}),
    });
    return;
  }

  const castErr = err as any;
  if (castErr.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
    return;
  }

  if (castErr.code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Duplicate entry',
    });
    return;
  }

  logger.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};
