import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let isConnected = false;

mongoose.connection.on('connected', () => {
  isConnected = true;
  logger.info('Mongoose connected');
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('Mongoose disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

export const connectDB = async () => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      bufferCommands: false,
      heartbeatFrequencyMS: 10000,
    });
    return conn;
  } catch (error) {
    logger.error('MongoDB connection error. Server will not start:', error);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('Mongoose disconnected gracefully');
};

export const getDBStatus = () => ({
  isConnected,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host,
  name: mongoose.connection.name,
});
