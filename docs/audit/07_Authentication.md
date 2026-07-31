# Authentication Flow: IoT Copilot AI

This document details the authentication and authorization strategy, which is fully powered by the **Better Auth** library.

## Overview

The platform uses `better-auth` as an all-in-one authentication solution. It handles user registration, login, session management via cookies, password resets, and social logins. 

### Why Better Auth?
Instead of manually wiring up `bcrypt`, `jsonwebtoken`, and custom Express middleware, Better Auth abstracts this away while providing a secure, Next.js-compatible API. It connects directly to MongoDB via the `mongodbAdapter`.

---

## Configuration (`server/src/config/auth.ts`)

The authentication instance is initialized after the MongoDB connection is established:
1. **Adapter:** Uses `mongodbAdapter(mongoose.connection.db)`. Better Auth manages the `user`, `session`, and `account` collections directly (which is why there is no Mongoose `User.ts` model).
2. **Plugins:** Uses the `admin()` plugin to handle basic role-based access control (RBAC).
3. **Providers:**
   - **Email & Password:** Enabled by default. Enforces a minimum password length of 6. Auto-signs in the user upon registration.
   - **Google OAuth:** Configured using `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
4. **Security & Cookies:**
   - Uses `httpOnly: true` cookies to prevent XSS attacks.
   - Sets `secure: true` in production (requires HTTPS).
   - `sameSite: 'lax'` is configured to allow cross-origin requests from the trusted frontend origin.
5. **Custom User Fields:**
   - Better Auth is configured to append custom fields to the user document: `role`, `skillLevel`, `bio`, `socialLinks`, and `preferences`. These are stored as strings (with JSON strings used for nested objects due to library constraints).

---

## Server Integration (`server/src/app.ts`)

- **Middleware:** `betterAuthMiddleware` is a custom Express middleware that wraps `getAuthHandler()`. 
- **Routing:** All requests to `/api/auth/*` are intercepted by this middleware. This means routes like `/api/auth/sign-in` and `/api/auth/sign-up` are automatically handled by the library—there are no manual controllers written for them.
- **Session Check Endpoint:** A custom `/api/auth/me` endpoint is defined. It extracts Node headers, passes them to `auth.api.getSession`, and returns the user object if a valid session cookie is present.

---

## Client Integration

On the Next.js client side, authentication state is likely managed by a Better Auth client-side hook (often wrapping React Query) or a Zustand store that queries `/api/auth/me` on mount.

### Protected Routes (Middleware)
Because Better Auth sets HttpOnly cookies, the Next.js frontend cannot read the token directly from `document.cookie`. Instead:
1. When navigating to a protected route (e.g., `/dashboard`), a Next.js middleware (or a layout component) makes a server-side check.
2. The browser automatically attaches the HttpOnly cookie to requests to `/api/auth/me`.
3. If the server returns a 401, the client redirects the user back to the login page.

---

## Password Resets
When a user requests a password reset, Better Auth generates a secure token and calls the `sendResetPassword` callback in `auth.ts`. This triggers the `sendPasswordResetEmail` service, which uses Nodemailer to send a reset link to the user.
