# Server Documentation: IoT Copilot AI

This document details the internal workings, conventions, and operational patterns of the Node.js/Express server.

## Overview
The server is built with **Node.js, Express, and TypeScript**. It acts as an API gateway, orchestrating requests between the client, the MongoDB database, and external services like the Gemini AI API and Cloudinary.

---

## 1. Bootstrapping & Lifecycle

### `server/src/server.ts`
This is the entry point of the backend application.
- **Initialization Order:** 
  1. Validates required environment variables via the `env.ts` config.
  2. Connects to MongoDB via Mongoose.
  3. Initializes Better Auth (`initAuth()`). Without a DB connection, Better Auth will fail to mount.
  4. Starts the Express server (`app.listen`).
- **Graceful Shutdown:** It listens for `SIGINT` and `SIGTERM` signals to cleanly disconnect from MongoDB and close the server, preventing dangling connections.

### `server/src/app.ts`
This file configures the Express application itself.
- Mounts security middlewares (Helmet, CORS, rate limit).
- Configures body parsers (JSON, urlencoded).
- Registers all API routers (`/api/users`, `/api/projects`, etc.).
- Mounts the `errorHandler` as the final middleware.

---

## 2. Request Handling Pipeline

The typical lifecycle of a request in this server follows a strict pattern:

1. **Route Match:** Express matches the path in `routes/`.
2. **Authentication Middleware:** If the route requires auth, it passes through an `authenticate` middleware. This checks the request for a valid Better Auth session. If missing, it immediately throws an unauthorized error.
3. **Validation Middleware:** Most POST/PUT routes use a Zod-based validation middleware (`validate({ body: schema, params: schema })`). This guarantees that the controller receives strongly-typed, sanitized data.
4. **Controller:** The controller extracts the validated data from `req.body` or `req.params`. It then calls one or more Service functions to perform the business logic.
5. **Service Layer:** Services execute complex logic (e.g., formatting prompts for AI, making database transactions).
6. **Response:** The controller takes the output of the Service and sends a standardized JSON response (`{ success: true, data: ... }`).

---

## 3. Error Handling

- **`errorHandler` Middleware:** The server uses a centralized error handler (`server/src/middlewares/errorHandler.ts`). Instead of wrapping every controller logic block in `try/catch` and sending custom `res.status(500)` calls, controllers pass errors to `next(err)`.
- **Custom Errors:** The system maps common database errors (like Mongoose CastErrors or Duplicate Key errors) into standardized HTTP 400-level responses before they reach the user.

---

## 4. Security Measures

- **Helmet:** Sets secure HTTP headers out of the box (e.g., preventing MIME-sniffing, XSS filters).
- **Express-Mongo-Sanitize:** Strips out keys containing `$` or `.` from `req.body`, `req.query`, or `req.params`. This is crucial for preventing NoSQL injection attacks where a malicious user might try to pass an object like `{ "$gt": "" }` to bypass authentication.
- **Express-Rate-Limit:** Implemented via `generalRateLimit` in `app.ts` and specifically via `aiRateLimit` on the AI routes to prevent API abuse and protect against runaway Gemini token costs.
