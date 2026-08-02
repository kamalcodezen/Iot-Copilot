# 04. Authentication

## Purpose
This document explains the identity, security, and session management layer of IoT Copilot using Better Auth.

## When to read
Read this when you need to understand how users are authenticated, how sessions are persisted, or how to protect new API routes and pages.

## Related documents
- [05. API](./05_API.md)

## Table of Contents
- [1. Overview](#1-overview)
- [2. Server Configuration](#2-server-configuration)
- [3. Client Configuration](#3-client-configuration)
- [4. State Synchronization](#4-state-synchronization)
- [5. Protected Routes & Middleware](#5-protected-routes--middleware)
- [6. Profile & Settings Updates](#6-profile--settings-updates)
- [7. Security Highlights](#7-security-highlights)
- [8. User Registration & Profile](#8-user-registration--profile)

## Main Content

The project uses [Better Auth](https://better-auth.com/) for secure authentication, completely removing the need for custom JWT implementations.

### 1. Overview
Better Auth provides secure, scalable authentication with built-in protections against CSRF, XSS, and session hijacking. It acts as the single source of truth for user identity across both the client and server.

### 2. Server Configuration (`server/src/config/auth.ts`)
The server initializes `betterAuth` using the MongoDB adapter.
- **Adapter:** `mongodbAdapter` connects directly to the Mongoose connection instance.
- **Plugins:** The `admin` plugin is included for future RBAC (Role-Based Access Control) support.
- **Node Handler:** `toNodeHandler` wraps the Better Auth instance so it can be mounted directly into Express via `app.all('/api/auth/*', ...)`.
- **Database Models:** Better Auth automatically provisions and manages the `user` and `session` collections in MongoDB. It does NOT use Mongoose for these specific collections to avoid schema collisions.

### 3. Client Configuration (`client/src/lib/auth-client.ts`)
The client initializes `createAuthClient` pointing to the backend API url (`/api/auth`).
- **Plugins:** The `adminClient` plugin is registered to match the server capabilities.
- **Export:** Exposes `authClient` which contains methods like `signUp.email()`, `signIn.email()`, `updateUser()`, `changePassword()`, and `signOut()`.

### 4. State Synchronization (Zustand)
Because Better Auth manages the actual HTTP-Only cookie, the client uses Zustand (`client/src/store/authStore.ts`) purely as a reactive cache for the UI.
- **`fetchMe()`:** Calls `authClient.getSession()`. If a session exists, it populates `state.user` and sets `isAuthenticated = true`.
- **Hydration:** This is called on the initial mount in `Navbar.tsx` and `Hero.tsx` to instantly update the UI (e.g., showing the user's avatar).

### 5. Protected Routes & Middleware
#### Server Middleware (`server/src/middlewares/auth.ts`)
Every protected API route passes through `requireAuth`.
- Uses `fromNodeHeaders` to convert Express headers into Fetch-compatible headers.
- Calls `auth.api.getSession({ headers })`.
- If valid, attaches the `user` and `session` objects to the Express `req` object for downstream controllers.
- If invalid, immediately returns a `401 Unauthorized` JSON response.

#### Client Protection
- Pages like `Dashboard`, `Settings`, and `Projects` utilize a `useEffect` hook that watches `isAuthenticated` and `isLoading`.
- If `!isAuthenticated && !isLoading`, it forces a `router.push('/auth/login')`.

### 6. Profile & Settings Updates
- **No Custom Backend Logic:** The `SettingsPage` (`client/src/app/settings/page.tsx`) communicates directly with Better Auth using `authClient.updateUser({ name })` and `authClient.changePassword()`. 
- **Revocation:** Changing the password automatically triggers session revocation for all other active devices using the `revokeOtherSessions: true` flag.

### 7. Security Highlights
- **No Local Storage JWTs:** Tokens are handled via Secure HTTP-Only cookies managed by Better Auth, mitigating XSS attacks.
- **Automatic Session Extension:** Sessions are transparently extended according to the Better Auth config logic.

### 8. User Registration & Profile
- **Purpose**: Allows users to join the platform and manage their identity.
- **How the user reaches it**: `/auth/register` and `/profile`.
- **Step-by-step**:
  1. User clicks Register.
  2. Form validation occurs on the client.
  3. Form submitted to backend (Next.js client talks directly to backend auth API or Better Auth).
  4. Session is created, cookie is set.
  5. User is redirected to `/dashboard`.
- **APIs called**: `POST /auth/register`
- **Expected result**: User is logged in and redirected.

## Related Source Code
- `server/src/config/auth.ts`
- `client/src/lib/auth-client.ts`
- `client/src/store/authStore.ts`
- `server/src/middlewares/auth.ts`

## Last Updated
2026-08-02
