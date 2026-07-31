# Environment Configuration: IoT Copilot AI

This document details the environment variables required to run the application in development or production.

## Configuration Strategy (`server/src/config/env.ts`)

Instead of accessing `process.env.*` directly throughout the codebase (which is error-prone and leads to hidden bugs if a variable is missing), the backend uses a centralized validation strategy in `env.ts`.
- When the server boots, `env.ts` evaluates all variables.
- Required variables use the `required(key)` function. If missing, it throws a fatal error immediately, preventing the server from starting in a broken state.
- Optional variables use `optional(key, fallback)` to provide sensible defaults.

---

## Required Server Variables

These must be present in the server's `.env` file for the application to boot successfully.

- `MONGODB_URI`: The connection string for the MongoDB instance (e.g., local or Atlas).
- `BETTER_AUTH_SECRET`: A cryptographic string used to sign sessions and JWTs.
- `GOOGLE_CLIENT_ID`: Required for Better Auth Google OAuth login.
- `GOOGLE_CLIENT_SECRET`: Required for Better Auth Google OAuth login.
- `FRONTEND_URL`: The origin of the client application (e.g., `http://localhost:3000`). Used to configure CORS and redirect URLs.
- `BETTER_AUTH_URL`: The base URL where the backend is hosted (e.g., `http://localhost:5000`), used by the auth library for callback URLs.

## Optional Server Variables

- `PORT`: (Default: `5000`) The HTTP port.
- `NODE_ENV`: (Default: `development`) Set to `production` in live environments to enforce secure cookies.
- `GEMINI_API_KEY`: Required to use AI features. Without this, the AI routes will throw a graceful 400 error.
- `GEMINI_MODEL`: (Default: `gemini-3.5-flash`) The specific Google LLM to use.
- `CLOUDINARY_*`: Cloud Name, API Key, and Secret for image uploads.
- `SMTP_*`: Host, Port, User, and Password for sending transactional emails (password resets).

---

## Client Variables

Next.js separates public variables (exposed to the browser) from private variables (only accessible during SSR/build time).

- `NEXT_PUBLIC_API_URL`: (e.g., `http://localhost:5000`) Used by Axios to know where the backend is. It must be prefixed with `NEXT_PUBLIC_` to be bundled into the React client.

---

## Security Audit

- The `.env.example` files should be thoroughly reviewed to ensure no actual API keys or secrets are accidentally committed.
- In production, these variables should be injected via the hosting provider's secret manager (e.g., Vercel Secrets, AWS Secrets Manager, or Railway variables) rather than relying on a static `.env` file.
