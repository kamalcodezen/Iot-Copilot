import app from './app';
import { connectDB, disconnectDB } from './config/db';
import { env } from './config/env';
import { logger } from './utils/logger';
import { initAuth } from "./config/auth";
import { Server } from 'http';

let server: Server | null = null;

async function start() {
  try {
    await connectDB();
    initAuth();
    logger.info('Better Auth initialized');

    await new Promise<void>((resolve, reject) => {
      server = app.listen(env.PORT);
      server.on('listening', () => {
        const url = env.NODE_ENV === 'production' ? (env.BETTER_AUTH_URL || `Port ${env.PORT}`) : `http://localhost:${env.PORT}`;
        logger.info(`Server running on ${url}`);
        resolve();
      });
      server.on('error', (err: Error) => {
        reject(err);
      });
    });
  } catch (error) {
    logger.error('CRITICAL: Failed to start server during initialization.', error);
    process.exit(1);
  }
}

function shutdown(signal: string) {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  if (server) {
    server.close(async (err) => {
      if (err) {
        logger.error('Error closing HTTP server:', err);
        process.exit(1);
      }
      await disconnectDB();
      logger.info('Graceful shutdown complete.');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000).unref();
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

start();
