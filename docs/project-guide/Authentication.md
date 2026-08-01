

<!-- Content from AUTHENTICATION.md -->

# Authentication

The project uses [Better Auth](https://better-auth.com/) for secure authentication.

## Session Flow
1. User logs in via credentials.
2. Better Auth validates the credentials against the DB.
3. Upon success, Better Auth generates a session and assigns an `HttpOnly`, `Secure` (in production) cookie.
4. Subsequent requests automatically include this cookie.

## Protected Routes
- **Frontend:** Handled by layout wrappers or higher-order components checking the user's session state. Unauthenticated users are redirected to `/login`.
- **Backend:** A `requireAuth` middleware extracts the cookie and validates the session via Better Auth before proceeding.

## Role-based Access
- Currently relies on a simple authentication check. Roles (like admin) can be extended in the `Users` schema.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [SECURITY.md](./SECURITY.md)
- **Revision History:** Initial release (v1.0.0)


<!-- Content from 08_Authentication.md -->

# 08. Authentication

IoT Copilot utilizes **Better Auth** as the primary authentication and session management framework, completely removing the need for custom JWT implementations.

## 1. Overview
Better Auth provides secure, scalable authentication with built-in protections against CSRF, XSS, and session hijacking. It acts as the single source of truth for user identity across both the client and server.

## 2. Server Configuration (`server/src/config/auth.ts`)
The server initializes `betterAuth` using the MongoDB adapter.
- **Adapter:** `mongodbAdapter` connects directly to the Mongoose connection instance.
- **Plugins:** The `admin` plugin is included for future RBAC (Role-Based Access Control) support.
- **Node Handler:** `toNodeHandler` wraps the Better Auth instance so it can be mounted directly into Express via `app.all('/api/auth/*', ...)`.
- **Database Models:** Better Auth automatically provisions and manages the `user` and `session` collections in MongoDB. It does NOT use Mongoose for these specific collections to avoid schema collisions.

## 3. Client Configuration (`client/src/lib/auth-client.ts`)
The client initializes `createAuthClient` pointing to the backend API url (`/api/auth`).
- **Plugins:** The `adminClient` plugin is registered to match the server capabilities.
- **Export:** Exposes `authClient` which contains methods like `signUp.email()`, `signIn.email()`, `updateUser()`, `changePassword()`, and `signOut()`.

## 4. State Synchronization (Zustand)
Because Better Auth manages the actual HTTP-Only cookie, the client uses Zustand (`client/src/store/authStore.ts`) purely as a reactive cache for the UI.
- **`fetchMe()`:** Calls `authClient.getSession()`. If a session exists, it populates `state.user` and sets `isAuthenticated = true`.
- **Hydration:** This is called on the initial mount in `Navbar.tsx` and `Hero.tsx` to instantly update the UI (e.g., showing the user's avatar).

## 5. Protected Routes & Middleware
### Server Middleware (`server/src/middlewares/auth.ts`)
Every protected API route passes through `requireAuth`.
- Uses `fromNodeHeaders` to convert Express headers into Fetch-compatible headers.
- Calls `auth.api.getSession({ headers })`.
- If valid, attaches the `user` and `session` objects to the Express `req` object for downstream controllers.
- If invalid, immediately returns a `401 Unauthorized` JSON response.

### Client Protection
- Pages like `Dashboard`, `Settings`, and `Projects` utilize a `useEffect` hook that watches `isAuthenticated` and `isLoading`.
- If `!isAuthenticated && !isLoading`, it forces a `router.push('/auth/login')`.

## 6. Profile & Settings Updates
- **No Custom Backend Logic:** The `SettingsPage` (`client/src/app/settings/page.tsx`) communicates directly with Better Auth using `authClient.updateUser({ name })` and `authClient.changePassword()`. 
- **Revocation:** Changing the password automatically triggers session revocation for all other active devices using the `revokeOtherSessions: true` flag.

## 7. Security Highlights
- **No Local Storage JWTs:** Tokens are handled via Secure HTTP-Only cookies managed by Better Auth, mitigating XSS attacks.
- **Automatic Session Extension:** Sessions are transparently extended according to the Better Auth config logic.


<!-- Content from 21_Architecture_Refactor_Report_Part_2.md -->

# Complete Project Documentation Report - Part 2

> [!NOTE]
> This is Part 2 of the comprehensive technical report covering the recent architecture refactor. It covers User Features, Admin Features, and the full Authentication flow.

## SECTION 7 — User Features

### 1. User Registration & Profile
- **Purpose**: Allows users to join the platform and manage their identity.
- **How the user reaches it**: `/auth/register` and `/profile`.
- **Step-by-step**:
  1. User clicks Register.
  2. Form validation occurs on the client.
  3. Form submitted to backend (Next.js client talks directly to backend auth API or Better Auth).
  4. Session is created, cookie is set.
  5. User is redirected to `/dashboard`.
- **APIs called**: `POST /auth/register`
- **Actions triggered**: N/A (Handled via Auth Library).
- **Data stored**: New user document in `Users` collection.
- **Expected result**: User is logged in and redirected.

### 2. IoT Project Creation
- **Purpose**: Users can showcase their IoT projects.
- **How the user reaches it**: `/projects/new`.
- **Step-by-step**:
  1. User fills out project details (title, description, code snippets, hardware list).
  2. Client-side validation.
  3. User clicks "Submit".
  4. Server Action `createProjectAction(data)` is triggered.
  5. Action calls `serverMutation('/projects', data)`.
  6. Backend creates project in DB.
  7. Action revalidates `/projects` and redirects to `/projects/[id]`.
- **APIs called**: `POST /projects`.
- **Actions triggered**: `createProjectAction`.
- **Data stored**: Document in `Projects` collection.
- **Expected result**: Project is published and visible on the feed.

### 3. Learning Paths
- **Purpose**: Users can enroll in IoT courses and track progress.
- **How the user reaches it**: `/learning`.
- **Step-by-step**:
  1. User views a learning path.
  2. Clicks "Enroll".
  3. `enrollInPathAction(pathId)` triggers.
  4. Progress is instantiated.
  5. User completes a module and clicks "Complete".
  6. `updateProgressAction(moduleId)` triggers.
- **APIs called**: `POST /learningPath/:id/enroll`, `PUT /learningPath/progress`.
- **Actions triggered**: `enrollInPathAction`, `updateProgressAction`.
- **Data stored**: Enrollment object in User document or related `Activity` table.
- **Expected result**: Progress bar updates on the UI.

### 4. Community Forums
- **Purpose**: Ask questions and share knowledge.
- **How the user reaches it**: `/community`.
- **Step-by-step**:
  1. User browses forum via Server Component fetching `getPosts()`.
  2. User creates a post.
  3. `createPostAction(data)` triggers `POST /community`.
  4. Database saves `Comment`/`Post` collection.
- **Expected result**: Post appears at the top of the forum.

---

## SECTION 8 — Admin Features

### 1. Admin Dashboard Overview
- **Purpose**: High-level view of platform health and metrics.
- **How to reach**: `/admin`.
- **Internal**: Server component calls `getSystemStats()` from `lib/api/admin.ts`. Shows user growth, active projects, etc.

### 2. User Moderation
- **Purpose**: Ban or suspend abusive users.
- **How to reach**: `/admin/users`.
- **Internal**: Admin clicks "Ban User". `banUserAction(userId)` is called. Triggers `PUT /admin/users/:id/ban`. User's role or status is updated in DB.

### 3. Content Moderation
- **Purpose**: Remove inappropriate projects or posts.
- **How to reach**: `/admin/projects` or directly on a project page if Admin.
- **Internal**: Admin clicks "Delete". `deleteAnyProjectAction(projectId)` triggers `DELETE /projects/:id` (admin override).

---

## SECTION 9 — Authentication Flow

Authentication is managed via a combination of Next.js cookies, custom API fetches, and Better Auth.

### Registration & Login
1. User submits credentials.
2. Request hits the backend `/auth/login` or `/auth/register`.
3. Backend validates credentials and issues a session token.
4. Token is set as an `httpOnly` cookie (`better-auth.session_token`).

### Session Persistence
- On every page load, Next.js Server Components that require auth call `requireAuth()` from `lib/core/session.ts`.
- `requireAuth()` calls `getUserSession()`.
- `getUserSession()` sends a `GET /auth/get-session` request to the backend.
- Crucially, it uses `authHeaders()` from `lib/core/server.ts` to manually forward the Next.js cookies to the backend.
- The backend validates the token and returns the `User` object.

### Protected Routes (Middleware vs Core)
- Most route protection is done inside Server Components by invoking `requireAuth()` at the top of the component:
  ```typescript
  const session = await requireAuth();
  ```
- If the session is null, `requireAuth()` calls `redirect('/auth/login')`.

### Authorization (Role-Based Access)
- For admin routes, `requireRole('admin')` is called.
- It first gets the session via `requireAuth()`, then checks `session.user.role === 'admin'`. If false, redirects to `/dashboard`.

### Logout
- Triggers a call to `POST /auth/logout`.
- The cookie is cleared on the client/Next.js server response.
- Redirects to `/`.
