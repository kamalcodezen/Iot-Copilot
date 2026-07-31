# Deployment Guide: IoT Copilot AI

This document provides a step-by-step guide for deploying the full-stack application to a production environment.

## Overview
The architecture requires deploying two separate components:
1.  **Frontend:** A Next.js App Router application (best deployed on Vercel).
2.  **Backend:** A Node.js/Express server (can be deployed on Render, Railway, AWS EC2, or DigitalOcean).
3.  **Database:** MongoDB (best hosted on MongoDB Atlas).

---

## 1. Database Setup (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under "Database Access", create a new database user with read/write privileges.
3. Under "Network Access", whitelist `0.0.0.0/0` (or specifically whitelist your backend server's IP if it's static).
4. Get the connection string (URI) and replace `<password>` with the user's password.

## 2. Backend Deployment (e.g., Render / Railway)
The backend must be deployed first so the frontend knows where to send API requests.

1.  **Environment Variables:** Prepare the following secrets for your hosting provider:
    -   `NODE_ENV=production`
    -   `PORT=5000` (or let the host assign one)
    -   `MONGODB_URI` (from Atlas)
    -   `FRONTEND_URL` (the anticipated domain for your Next.js app, e.g., `https://iot-copilot.vercel.app`)
    -   `BETTER_AUTH_SECRET` (generate a random 32-character string)
    -   `BETTER_AUTH_URL` (the backend URL you are about to create, e.g., `https://iot-copilot-api.onrender.com`)
    -   `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (from Google Cloud Console)
    -   `GEMINI_API_KEY` (from Google AI Studio)
    -   `CLOUDINARY_*` keys.

2.  **Build Command:** Set the build command to:
    ```bash
    npm install && npm run build
    ```
    *(Ensure this is run inside the `server/` directory if using a monorepo).*

3.  **Start Command:** Set the start command to:
    ```bash
    npm start
    ```

## 3. Frontend Deployment (Vercel)
Vercel is the optimal host for Next.js applications.

1.  Import your GitHub repository into Vercel.
2.  Set the Root Directory to `client/` (if it's a monorepo setup).
3.  **Environment Variables:** Add the required public variables:
    -   `NEXT_PUBLIC_API_URL` (set to your newly deployed backend URL, e.g., `https://iot-copilot-api.onrender.com`).
4.  **Build Command:** Vercel should auto-detect Next.js (`npm run build`).
5.  Deploy.

---

## 4. Post-Deployment Checks
1.  **CORS:** Ensure `FRONTEND_URL` in the backend exactly matches the deployed Vercel URL (no trailing slash). If it doesn't match, CORS will block all requests.
2.  **Cookies:** In production, Better Auth sets cookies to `secure: true`. This requires both the frontend and backend to be served over HTTPS. Ensure SSL certificates are active.
3.  **Google OAuth:** Go to the Google Cloud Console and add your deployed `FRONTEND_URL` to the "Authorized JavaScript origins" and `BETTER_AUTH_URL/api/auth/callback/google` to the "Authorized redirect URIs".
