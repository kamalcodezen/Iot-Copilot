# 19. Code Execution Flow

This document traces the exact path of execution through the IoT Copilot codebase for a typical authenticated request, bridging the gap between the frontend UI and the backend database.

## 1. Client-Side Initiation (The Browser)
Let's trace the flow of a user requesting their Dashboard data.

1. **Component Mount:** `client/src/app/dashboard/page.tsx` mounts in the browser.
2. **State Check:** `useAuthStore()` (from `store/authStore.ts`) confirms the user is authenticated.
3. **Trigger Fetch:** The `useEffect` hook in `DashboardPage` calls `fetchData()`.
4. **API Wrapper (Parallel Execution):** `fetchData` invokes multiple Server Actions concurrently via `Promise.all`: `getActivityStats()`, `getActivities()`, and `getProjects()`. This parallel database query design massively improves Dashboard loading performance.
5. **Server Fetch Util:** Each action utilizes `serverFetch<T>('/endpoint')` (`lib/core/server.ts`).
   - `serverFetch` executes on the Next.js server, prepends the backend `API_URL`.
   - It automatically extracts and forwards Next.js credentials (cookies) so Better Auth can validate the session.

## 2. Server-Side Ingress (Express App)
1. **HTTP Entry:** The request hits `server/src/app.ts`.
2. **Global Middleware:** 
   - `cors` allows the request because the origin matches `CLIENT_URL`.
   - `helmet` sets secure HTTP headers.
   - `express.json()` parses any payload (empty for a GET request).
3. **Router Delegation:** `app.use('/api/dashboard', dashboardRoutes)` forwards the request to `server/src/routes/dashboardRoutes.ts`.

## 3. Route Authentication & Controller
1. **Auth Middleware:** In `dashboardRoutes.ts`, the route is defined as `router.get('/stats', requireAuth, getDashboardStats)`.
2. **Validation (`requireAuth`):** 
   - Execution jumps to `server/src/middlewares/auth.ts`.
   - `betterAuth` verifies the HTTP-Only cookie attached to the request headers.
   - The verified user ID is attached to `req.user`.
3. **Controller Execution:** Execution moves to `getDashboardStats` in `server/src/controllers/dashboardController.ts`.

## 4. Database Interaction (Mongoose)
1. **Query Construction:** The controller extracts `req.user.id`.
2. **Model Invocation:** It calls `Activity.aggregate(...)` and `Project.countDocuments(...)` from `server/src/models/`.
3. **Database Execution:** Mongoose translates these calls into raw MongoDB queries and executes them against the Atlas cluster.
4. **Data Aggregation:** The results are mapped into the `StatsData` interface format.

## 5. Response & Client Hydration
1. **Server Response:** The controller calls `res.json({ status: 'success', data: stats })`.
2. **Client Parsing:** Back in the browser, `clientFetch` receives the JSON, checks for HTTP errors, and returns the parsed data.
3. **React State Update:** `DashboardPage` calls `setStats(data)` and `setLoading(false)`.
4. **Render:** Framer Motion variants trigger, and components like `ProgressChart` and `StatsBar` re-render with the real data, updating the DOM.

---

### Special Case: Server-Sent Events (AI Streaming)
If the flow involves the AI Mentor:
- The client uses standard Fetch API but reads the response body via a reader (`response.body.getReader()`).
- The server (`aiController.ts`) sets headers `Content-Type: text/event-stream` and pipes chunks directly from the Groq SDK to `res.write()`.
- This creates an open pipeline where data flows continuously from Groq -> Server -> Client without waiting for the full response to complete.
