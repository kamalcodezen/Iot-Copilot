# Architecture: IoT Copilot AI

This document explains the complete architectural design of the IoT Copilot AI project, breaking down the client, server, data flow, and specific subsystems.

## High-Level Architecture

The project follows a standard modern decoupled **Client-Server Architecture**:
1.  **Client:** A React 19 application built on Next.js 16 (App Router), responsible for UI, state management, and user interactions.
2.  **Server:** A Node.js runtime running an Express.js server written in TypeScript. It handles business logic, database interactions, authentication, and communication with external APIs (like Gemini AI).
3.  **Database:** MongoDB, managed via Mongoose schemas.
4.  **External Services:**
    -   Google Gemini API (for AI features)
    -   Cloudinary (for image/asset hosting)
    -   SMTP/Email provider (Nodemailer)

---

## Client Architecture

The frontend is built using Next.js App Router (`client/src/app`).

-   **Routing Layer:** The App Router handles routing based on the file system (e.g., `/dashboard`, `/ai-mentor`, `/projects`).
-   **UI Layer:** Built with Tailwind CSS v4 and Framer Motion for animations. It relies heavily on reusable React components in `client/src/components`.
-   **State Management:**
    -   *Server State:* TanStack React Query handles fetching, caching, synchronizing, and updating server data.
    -   *Client State:* Zustand is used for global client-side state (like UI toggles, temporary project states).
-   **Service Layer:** API calls are abstracted into `client/src/services` using Axios.

---

## Server Architecture

The backend is an Express.js server (`server/src/app.ts`).

-   **Entry Point:** `server.ts` bootstraps the server, connects to MongoDB, and listens on a port. `app.ts` configures the Express middleware and routes.
-   **Middleware Layer:** Global middleware includes Helmet (security headers), CORS, Mongo Sanitize (NoSQL injection prevention), rate limiting, and an error handler.
-   **Routing Layer:** Routes are modularized in `server/src/routes` (e.g., `user`, `project`, `ai`, `auth`).
-   **Controller Layer:** Controllers (`server/src/controllers`) handle HTTP requests, extract data, and invoke services.
-   **Service Layer:** Business logic resides in `server/src/services` (e.g., interacting with Gemini, formatting data).
-   **Data Access Layer:** Mongoose models (`server/src/models`) define the schema and handle direct database operations.

---

## Complete Data & Request Flow

1.  **User Action:** The user interacts with the UI (e.g., clicks "Ask AI").
2.  **Client Request:** React triggers a function in the service layer using Axios or React Query.
3.  **Network Transport:** An HTTP request (or SSE connection for streaming) is sent to the Express server.
4.  **Server Routing:** Express matches the route and passes the request through middleware (Auth, Validation).
5.  **Controller Execution:** The controller processes the request and calls the appropriate Service.
6.  **Service Processing:**
    -   If data is needed, it calls the Mongoose Model.
    -   If AI is needed, it makes a fetch call to the Gemini API.
7.  **Database Interaction:** Mongoose queries MongoDB and returns the document.
8.  **Server Response:** The controller formats the final data and sends a JSON response (or streams SSE events).
9.  **Client Update:** React Query caches the response, Zustand updates if necessary, and the React UI re-renders.

---

## Authentication Flow

Authentication is powered by **Better Auth**.

1.  **Login/Register:** User submits credentials to `/api/auth/*`.
2.  **Token Generation:** Better Auth validates the user and generates a Session Token (usually stored as an HttpOnly cookie) and a JWT.
3.  **Protected Routes (Client):** Next.js middleware checks for the session cookie before allowing access to private routes like `/dashboard`.
4.  **Protected Endpoints (Server):** Express uses `betterAuthMiddleware` to extract headers/cookies, fetch the session via `auth.api.getSession`, and attach the user object to the request. If unauthorized, it returns a `401`.

---

## AI Flow (Gemini Integration)

1.  **Context Assembly:** When the user asks a question, the backend AI service fetches their active project data, recent conversation history (from the `AIMemory` collection), and hardware preferences.
2.  **Prompt Engineering:** The server dynamically constructs a system prompt injecting this context.
3.  **Streaming:** To provide a fast, "typing" UX, the server connects to the Gemini API using Server-Sent Events (SSE).
4.  **Forwarding:** As Gemini streams the response tokens back to the server, the server immediately forwards them to the Next.js client via the `text/event-stream` protocol.

---

## Database Flow

-   **ODM:** Mongoose is used as the Object Data Modeling library.
-   **Validation:** Mongoose schemas enforce data types and constraints before saving to MongoDB. The server also uses validation libraries (like Zod) in middleware before the request reaches the controller.
-   **Relations:** References between collections (e.g., a `Project` belongs to a `User`) are stored as `ObjectId`. Mongoose's `.populate()` is used to join documents when requested by the client.
