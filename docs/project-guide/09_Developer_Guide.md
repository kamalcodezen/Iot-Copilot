# 09. Developer Guide

## Purpose
This document outlines how to set up your environment, coding standards, and debugging workflows.

## When to read
Read this on your first day joining the project, or when you need a refresher on debugging techniques.

## Related documents
- [03. Folder Structure](./03_Folder_Structure.md)

## Table of Contents
- [1. Quick Start / Installation](#1-quick-start--installation)
- [2. Coding Rules & Standards](#2-coding-rules--standards)
- [3. How to Debug](#3-how-to-debug)
- [4. Creating New Features](#4-creating-new-features)
- [5. Technical Debt & Unused Code](#5-technical-debt--unused-code)

## Main Content

Welcome to the IoT Copilot engineering team.

### 1. Quick Start / Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kamalcodezen/Iot-Copilot.git
   cd Iot-Copilot
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Fill out MONGODB_URI, BETTER_AUTH_SECRET, GROQ_API_KEY
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   cp .env.local.example .env.local
   # Ensure NEXT_PUBLIC_API_URL is set to http://localhost:5000/api
   npm run dev
   ```

### 2. Coding Rules & Standards

#### Naming Conventions
- **Files/Folders:** `kebab-case` for routes/directories. `PascalCase` for React components (`Button.tsx`). `camelCase` for utils (`formatDate.ts`).
- **Variables/Functions:** `camelCase`.
- **Types/Interfaces:** `PascalCase`. Prefix interfaces only if necessary; generally prefer plain descriptive names (`User`, not `IUser`).

#### Frontend (Next.js & React)
- **Use the App Router:** All new pages must be created inside `client/src/app`.
- **Feature-Driven Architecture:** Do not dump everything into `components/`. If a component contains heavy business logic (e.g., `ProjectTimeline`), place it in `features/projects/components/`.
- **Styling:** Use Tailwind CSS exclusively. Use the `cn()` utility to merge dynamic classes safely. Do not use inline styles unless absolutely necessary for dynamic layout calculations.
- **Client Components:** Next.js App Router defaults to Server Components. If you need `useState` or `useEffect` (which is common in this app), you must add `'use client';` at the very top of the file.
- **Accessibility & Polish:** Ensure all interactive elements are accessible. Use proper semantic HTML, ARIA labels, and maintain high contrast ratios for the glassmorphic UI elements.

#### Backend (Express & Node.js)
- **Thin Controllers:** Controllers should only parse requests and format responses. Heavy business logic must live in `services/`.
- **Validation:** Always use Zod schemas in `validators/` to check incoming request bodies before they reach the controller.
- **Async/Await:** Do not use `.then()`. Use `async/await` and wrap route handlers in an error-catching utility or `try/catch` blocks.

### 3. How to Debug

#### Frontend Debugging
- **React Developer Tools:** Use the browser extension to inspect component state, especially the Zustand `authStore`.
- **Framer Motion Issues:** If animations are glitching, ensure you are not passing `undefined` to SVG attributes (e.g., `r={node.r || 10}`). This will cause hydration/rendering errors.
- **Lenis Smooth Scrolling:** If scroll locking or smooth scrolling breaks, ensure the global Lenis instance is not conflicting with `overflow: hidden` on nested absolute containers.

#### Backend Debugging
- **Better Auth:** If authentication fails, check the server console. Better Auth logs errors verbosely in development mode.
- **Groq API:** If the AI features stop working, check if a `429 Quota Exceeded` error is being returned from Google. Ensure your `.env` contains a valid, funded API key.
- **Node Debugger:** Attach a Node debugger to port `9229`.

### 4. Creating New Features

#### Adding a New Server Action (Mutation)
1. Navigate to `client/src/lib/actions/`.
2. Open/create the file (e.g., `devices.ts`).
3. Export an async function utilizing `serverMutation`.
4. Call `revalidatePath` to ensure the UI updates after the mutation.

#### Adding a New API (Query)
1. Navigate to `client/src/lib/api/`.
2. Create or open the relevant file (e.g., `devices.ts`).
3. Export an async function utilizing `serverFetch` for API calls.

#### Adding a New API Endpoint (Backend)
1. Create a route in `server/src/routes/`.
2. Map it to a Controller in `server/src/controllers/`.
3. Put the actual logic in `server/src/services/`.
4. Validate input using `server/src/validators/`.

### 5. Technical Debt & Unused Code
During the documentation process, the following areas were identified as potential technical debt or requiring future cleanup:

1. **Unused Code / Dead Code:**
   - Any hardcoded JWT token generation utilities in the backend.
2. **Security Improvements:**
   - **Rate Limiting:** Implement a strict Express rate limiter (`express-rate-limit`) on all `/api/ai/*` routes to prevent abuse of the Groq API key.
   - **Environment Variables:** Rotate `BETTER_AUTH_SECRET` before pushing to a production environment.
3. **Performance Improvements:**
   - **Database Indexes:** Ensure compound indexes on the `Activity` collection are utilized effectively, as this collection will grow exponentially compared to others.
   - **Frontend Bundle Size:** Monitor the impact of `framer-motion` and `recharts`. Consider dynamically importing heavy chart components only when they scroll into view.
4. **Scalability:**
   - **WebSockets:** Transition the Dashboard from HTTP Polling to WebSockets or Server-Sent Events (SSE) for real-time activity updates.
   - **Microservices:** If the AI processing becomes computationally expensive or requires heavy background jobs, consider offloading the AI logic to a dedicated microservice.

## Related Source Code
- `client/package.json`
- `server/package.json`

## Last Updated
2026-08-02
