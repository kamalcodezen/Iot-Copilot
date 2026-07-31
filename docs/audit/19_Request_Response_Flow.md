# Request & Response Flow Documentation: IoT Copilot AI

This document maps out the lifecycle of a single HTTP request from the moment it leaves the browser to the moment a response is rendered on the screen.

---

## 1. The Client-Side Request

1. **User Action:** The user performs an action (e.g., clicks "Save Profile").
2. **Component Execution:** The React component triggers a function.
3. **Data Formatting:** The function formats the state data into a JSON payload.
4. **Axios Interception:** 
   - Before the request leaves the client, Axios Request Interceptors can attach headers. In this architecture, because authentication uses HTTP-only cookies, Axios is configured with `withCredentials: true`. The browser automatically attaches the Better Auth session cookie.
5. **Network Dispatch:** The HTTP request (e.g., `PUT /api/users/123`) is sent over the network.

---

## 2. The Server-Side Pipeline

When the request hits the Express backend, it passes through a strict sequence of middlewares.

### A. Pre-Processing (Global Middleware)
1. **Security Headers:** `helmet()` adds headers like `X-Content-Type-Options`.
2. **CORS:** Validates the origin against `env.FRONTEND_URL`.
3. **Body Parsing:** `express.json({ limit: '10mb' })` parses the string payload into a JavaScript object (`req.body`).
4. **Sanitization:** `mongoSanitize()` strips out any keys starting with `$` or `.` to prevent NoSQL injection.
5. **Rate Limiting:** `generalRateLimit` increments a counter for the user's IP. If exceeded, returns `429 Too Many Requests`.

### B. Routing & Auth
6. **Router Match:** Express matches `/api/users/123`.
7. **Authentication:** The `authenticate` middleware extracts the Node headers, queries Better Auth (`auth.api.getSession`), and validates the cookie. 
   - If invalid, throws `UnauthorizedError (401)`.
   - If valid, attaches the user object to `req.user` and calls `next()`.

### C. Validation
8. **Zod Validation:** The `validate({ body: updateProfileSchema, params: mongoIdParams })` middleware checks `req.body` and `req.params`.
   - If invalid, throws a `ValidationError (400)` with specific details (e.g., "Bio must be less than 500 characters").
   - If valid, calls `next()`.

### D. Business Logic (Controller & Service)
9. **Controller Execution:** The `updateProfile` controller extracts the validated data.
10. **Service Call:** The controller calls a service function (or uses Mongoose directly for simple CRUD).
11. **Database Execution:** Mongoose executes a `findOneAndUpdate` query against MongoDB.
12. **Response Shaping:** The controller wraps the returned document in a standardized JSON envelope:
    ```json
    {
      "success": true,
      "data": { ... }
    }
    ```
13. **Dispatch:** `res.json()` sends the payload back to the client.

---

## 3. The Client-Side Response

14. **Axios Interception:** 
    - The Axios Response Interceptor catches the incoming response.
    - If the status is `200/201`, it passes the data to the calling function.
    - If the status is `401 Unauthorized` (meaning the session expired), the interceptor automatically redirects the user to `/auth/login` and clears local state.
    - If it's a `400` or `500` error, it rejects the promise.
15. **State Management:** React Query (or Zustand) receives the data and updates its internal cache.
16. **UI Update:** The UI re-renders with the new data, and a success toast is displayed.
