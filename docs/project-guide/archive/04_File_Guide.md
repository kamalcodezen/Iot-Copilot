# 04. File Guide

This guide details the purpose and execution context of the most critical files in the IoT Copilot ecosystem.

## 1. Client Root Files

### `client/src/app/layout.tsx`
- **Purpose:** The root HTML wrapper for the entire application.
- **Responsibility:** Injects global fonts (Inter, JetBrains Mono, custom Sekuya), sets the `<body>` classes, and mounts global providers like `Toaster` and `NextTopLoader`.
- **Who uses it:** Next.js App Router uses it automatically for every page.
- **When it executes:** On the initial server render and during client-side hydration.

### `client/src/store/authStore.ts`
- **Purpose:** Zustand store for global authentication state.
- **Responsibility:** Tracks `user` object, `isAuthenticated`, and `isLoading`. Provides actions like `fetchMe()`, `logout()`, and `setLoading()`.
- **Who imports it:** `Navbar.tsx`, `DashboardPage`, `SettingsPage`, `Hero.tsx`.
- **When it executes:** Accessed whenever a component needs to check if a user is logged in, or when triggering a logout.

### `client/src/lib/auth-client.ts`
- **Purpose:** Initializes the Better Auth frontend client.
- **Responsibility:** Configures plugins (`adminClient`) and sets the `baseURL` for backend requests.
- **Who imports it:** `authStore.ts` (for fetching session), `RegisterPage` (for signing up), `SettingsPage` (for updating profile).
- **When it executes:** Upon import (singleton instance).

### `client/src/lib/api/ai-stream.ts`
- **Purpose:** Utility for reading Server-Sent Events (SSE) from the Groq AI backend.
- **Responsibility:** Exposes `streamAIResponse()` which uses the browser's native `fetch` and `ReadableStream` API to parse text chunks in real time. Contains robust error parsing logic for rate limits.
- **Who imports it:** `ChatContainer.tsx`.
- **When it executes:** Whenever a user submits a prompt to the AI Mentor.

## 2. Server Root Files

### `server/src/app.ts`
- **Purpose:** The core Express application instance.
- **Responsibility:** Mounts global middlewares (CORS, Helmet, JSON parsing), initializes the Better Auth router handler, and maps all domain routers (`/api/ai`, `/api/projects`).
- **Who imports it:** `server.ts`.
- **When it executes:** Bootstrapped once on server start.

### `server/src/server.ts`
- **Purpose:** The application entry point.
- **Responsibility:** Loads environment variables, connects to MongoDB via `connectDB()`, and calls `app.listen()` to bind to a port.
- **When it executes:** Only executed by Node.js on application startup.

### `server/src/config/db.ts`
- **Purpose:** MongoDB connection logic.
- **Responsibility:** Uses Mongoose to connect to Atlas, handles graceful degradation and logging.
- **Who imports it:** `server.ts`.

### `server/src/services/ai.ts`
- **Purpose:** Groq SDK abstraction layer.
- **Responsibility:** Manages the `GoogleGenerativeAI` instance, implements robust `withRetry` logic for handling 429 Rate Limit errors, and exports highly specific functions like `chat()`, `generateRoadmap()`, and `debugCode()`.
- **Who imports it:** `aiController.ts`.
- **When it executes:** When any AI-related endpoint is hit.

## 3. Configuration Files

### `client/tailwind.config.ts`
- **Purpose:** The master design token registry.
- **Responsibility:** Defines custom colors (`bg-deep-blue`, `accent`), animations (`pulse-soft`, `float`, `gradient-x`), and border radii.
- **Who uses it:** PostCSS/Tailwind compiler.

### `server/.env`
- **Purpose:** Secrets storage.
- **Responsibility:** Holds `MONGODB_URI`, `BETTER_AUTH_SECRET`, `GROQ_API_KEY`.
- **Who uses it:** `process.env` accessed throughout the backend.
