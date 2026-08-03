# 10. Deployment

## Purpose
This document provides instructions for deploying the frontend and backend applications to cloud providers.

## When to read
Read this before pushing code to a production environment.

## Related documents
- [09. Developer Guide](./09_Developer_Guide.md)

## Table of Contents
- [1. Environment Variables](#1-environment-variables)
- [2. Frontend Deployment (Vercel)](#2-frontend-deployment-vercel)
- [3. Backend Deployment (Render / Heroku)](#3-backend-deployment-render--heroku)
- [4. Database Setup (MongoDB Atlas)](#4-database-setup-mongodb-atlas)
- [5. Security Checklist Before Production](#5-security-checklist-before-production)

## Main Content

IoT Copilot is designed to be easily deployable on modern cloud infrastructure, specifically Vercel for the frontend and Render/Heroku for the backend, with MongoDB Atlas handling the data layer.

### 1. Environment Variables

The project requires the following environment variables to run. These must be configured in your deployment platform.

**Backend (`server/.env`)**
```bash
# Core
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/iot-copilot?retryWrites=true&w=majority

# Better Auth Configuration
BETTER_AUTH_SECRET=your_super_secret_generated_string
BETTER_AUTH_URL=https://api.yourdomain.com

# AI Integration
GROQ_API_KEY=your_google_ai_studio_api_key

# CORS
CLIENT_URL=https://yourdomain.com
```

**Frontend (`client/.env.local` or `.env`)**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Frontend Deployment (Vercel)
The client is a standard Next.js application, which makes Vercel the optimal deployment target.

1. Connect your GitHub repository to Vercel.
2. Set the **Framework Preset** to `Next.js`.
3. Set the **Root Directory** to `client`.
4. Add the `NEXT_PUBLIC_API_URL` environment variable.
5. Deploy. Vercel will automatically run `npm run build` and output the optimized static and server-rendered assets.

### 3. Backend Deployment (Render / Heroku)
The backend is a Node.js Express server compiled from TypeScript.

1. **Build Step:** The deployment script must compile TypeScript to JavaScript.
   ```bash
   cd server
   npm install
   npm run build
   ```
2. **Start Command:**
   ```bash
   node dist/server.js
   ```
3. Ensure all environment variables are mapped in the platform's dashboard.

### 4. Database Setup (MongoDB Atlas)
1. Create a free or dedicated cluster on MongoDB Atlas.
2. In **Network Access**, ensure the IP addresses of your backend deployment platform (e.g., Render) are whitelisted, or allow all (`0.0.0.0/0`) if using a dynamic IP platform.
3. Obtain the connection string and set it as `MONGODB_URI` in the backend. Better Auth and Mongoose will automatically create the necessary collections on first boot.

### 5. Security Checklist Before Production
- Ensure `BETTER_AUTH_SECRET` is a strong, cryptographically secure string (e.g., generated via `openssl rand -base64 32`).
- Verify `CORS` is strictly limited to your `CLIENT_URL` in `server/src/app.ts`.
- Ensure Groq API quotas are monitored, as high traffic to the AI features can exhaust free tier limits.

## Related Source Code
- `client/package.json`
- `server/package.json`

## Last Updated
2026-08-02
