import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { admin } from 'better-auth/plugins';
import { toNodeHandler } from 'better-auth/node';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { sendPasswordResetEmail } from '../services/email';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _auth: any = null;

export function getAuth() {
  if (!_auth) {
    throw new Error('Auth not initialized. Call initAuth() after MongoDB connects.');
  }
  return _auth;
}

export function getAuthHandler() {
  const auth = getAuth();
  return toNodeHandler(auth);
}

export function initAuth() {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB not connected. Cannot initialize auth.');
  }

  _auth = betterAuth({
    database: mongodbAdapter(db),
    appName: 'IoT Copilot AI',
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 6,
      maxPasswordLength: 128,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        try {
          const tokenMatch = url.match(/\/reset-password\/([^?]+)/);
          if (tokenMatch) {
            await sendPasswordResetEmail(user.email, tokenMatch[1]);
          }
        } catch {
          logger.warn(`Password reset email could not be sent to ${user.email}`);
        }
      },
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    trustedOrigins: [env.FRONTEND_URL], // FIX: Allow frontend to establish sessions
    plugins: [admin()],
    advanced: {
      defaultCookieAttributes: {
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
        httpOnly: true,
      },
      crossSubDomainCookies: {
        enabled: true,
        domain: 'localhost',
      },
    },
    user: {
      deleteUser: {
        enabled: true,
      },
      modelName: 'user',
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'user',
          input: false,
        },
        skillLevel: {
          type: 'string',
          required: false,
          defaultValue: 'beginner',
          input: false,
        },
        bio: {
          type: 'string',
          required: false,
          defaultValue: '',
          input: true,
        },
        socialLinks: {
          type: 'string',
          required: false,
          defaultValue: JSON.stringify({ github: '', linkedin: '', twitter: '' }),
          input: false,
        },
        preferences: {
          type: 'string',
          required: false,
          defaultValue: JSON.stringify({ theme: 'dark', emailNotifications: true, language: 'en' }),
          input: false,
        },
      },
    },
    rateLimit: {
      window: 900,
      max: 100,
    },
  });

  return _auth;
}
