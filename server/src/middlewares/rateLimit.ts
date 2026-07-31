import rateLimit from 'express-rate-limit';
import { AI_RATE_LIMIT } from '../utils/constants';

export const aiRateLimit = rateLimit({
  windowMs: AI_RATE_LIMIT.WINDOW_MS,
  max: AI_RATE_LIMIT.MAX_REQUESTS,
  message: { success: false, message: 'Too many AI requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
