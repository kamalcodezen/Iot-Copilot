import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Environment variable ${key} is required but not set. Server cannot start.`);
  }
  return value.trim();
}

function optional(key: string, fallback: string): string {
  return process.env[key]?.trim() || fallback;
}

function optionalInt(key: string, fallback: number): number {
  const raw = process.env[key]?.trim();
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return fallback;
}

export const env = {
  PORT: optionalInt('PORT', 5000),
  NODE_ENV: optional('NODE_ENV', 'development'),

  MONGODB_URI: required('MONGODB_URI'),
  BETTER_AUTH_SECRET: required('BETTER_AUTH_SECRET'),

  GOOGLE_CLIENT_ID: required('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: required('GOOGLE_CLIENT_SECRET'),

  FRONTEND_URL: required('FRONTEND_URL'),
  BETTER_AUTH_URL: required('BETTER_AUTH_URL'),

  GEMINI_API_KEY: optional('GEMINI_API_KEY', ''),
  GEMINI_MODEL: optional('GEMINI_MODEL', 'gemini-3.5-flash'),

  CLOUDINARY_CLOUD_NAME: optional('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: optional('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: optional('CLOUDINARY_API_SECRET', ''),

  SMTP_HOST: optional('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: optionalInt('SMTP_PORT', 587),
  SMTP_USER: optional('SMTP_USER', ''),
  SMTP_PASS: optional('SMTP_PASS', ''),
};

export type Env = typeof env;
