# 13. Developer Guide

Welcome to the IoT Copilot engineering team. This guide outlines how to set up your environment, our coding standards, and how to debug the application.

## 1. Quick Start / Installation

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
   # Fill out MONGODB_URI, BETTER_AUTH_SECRET, GEMINI_API_KEY
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

## 2. Coding Rules & Standards

### Frontend (Next.js & React)
- **Use the App Router:** All new pages must be created inside `client/src/app`.
- **Feature-Driven Architecture:** Do not dump everything into `components/`. If a component contains heavy business logic (e.g., `ProjectTimeline`), place it in `features/projects/components/`.
- **Styling:** Use Tailwind CSS exclusively. Use the `cn()` utility to merge dynamic classes safely. Do not use inline styles unless absolutely necessary for dynamic layout calculations.
- **Client Components:** Next.js App Router defaults to Server Components. If you need `useState` or `useEffect` (which is common in this app), you must add `'use client';` at the very top of the file.

### Backend (Express & Node.js)
- **Thin Controllers:** Controllers should only parse requests and format responses. Heavy business logic must live in `services/`.
- **Validation:** Always use Zod schemas in `validators/` to check incoming request bodies before they reach the controller.
- **Async/Await:** Do not use `.then()`. Use `async/await` and wrap route handlers in an error-catching utility or `try/catch` blocks.

## 3. How to Debug

### Frontend Debugging
- **React Developer Tools:** Use the browser extension to inspect component state, especially the Zustand `authStore`.
- **Framer Motion Issues:** If animations are glitching, ensure you are not passing `undefined` to SVG attributes (e.g., `r={node.r || 10}`). This will cause hydration/rendering errors.

### Backend Debugging
- **Better Auth:** If authentication fails, check the server console. Better Auth logs errors verbosely in development mode.
- **Gemini API:** If the AI features stop working, check if a `429 Quota Exceeded` error is being returned from Google. Ensure your `.env` contains a valid, funded API key.
