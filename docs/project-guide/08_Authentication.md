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
