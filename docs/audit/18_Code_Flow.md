# Code Flow Documentation: IoT Copilot AI

This document explains the general execution path of code from application initialization to user interaction.

---

## 1. Backend Boot Sequence

The server execution begins in `server/src/server.ts`:
1.  **Environment Check:** Reads `.env` and validates secrets (MongoDB URI, Gemini API Key).
2.  **Database Connection:** Mongoose connects to MongoDB.
3.  **Auth Initialization:** `betterAuth` is initialized using the MongoDB connection.
4.  **Express Mount:** The `app.ts` file is imported. Middlewares (Helmet, CORS, rate limits) are registered.
5.  **Route Registration:** All API routes are mounted to `/api/*`.
6.  **Listen:** The HTTP server starts listening on the defined port (usually 5000).

## 2. Frontend Boot Sequence

The client execution begins via Next.js App Router:
1.  **Server-Side Rendering (SSR):** Next.js processes `client/src/app/layout.tsx`.
2.  **Hydration:** React hydrates the HTML on the client.
3.  **Global Stores Initialization:** Zustand stores are instantiated.
4.  **Auth Check:** If the user visits a protected route, Next.js middleware checks the Better Auth session cookie.
5.  **Component Mount:** Page components mount and optionally trigger React Query hooks to fetch initial data (like Dashboard stats).

## 3. General User Interaction Flow

When a user clicks a button (e.g., "Create Project"):
1.  **UI Component:** The React component (e.g., `<Button>`) captures the `onClick` event.
2.  **Form Validation:** If it's a form, `react-hook-form` validates the input against a Zod schema defined in `validation.ts`.
3.  **Client Service Call:** If valid, the component calls a React Query mutation or an Axios wrapper in `client/src/services`.
4.  **Network Transport:** An HTTP POST request is sent to `/api/projects`.
5.  **Backend Controller:** 
    - The request passes through Express Auth and Validation middleware.
    - The `createProject` controller extracts the body.
    - It saves the document to MongoDB via the Mongoose model.
    - It returns a 201 Created JSON response.
6.  **Client State Update:** React Query receives the success response, invalidates the "projects" cache, and triggers a UI re-render to show the new project. A success toast is displayed.

## 4. AI Interaction Flow (Streaming)

When a user asks the AI a question:
1.  **UI Component:** The user submits a chat message in `<AIAssistant>`.
2.  **State Update:** Zustand appends a placeholder message to the chat UI and sets `isGenerating = true`.
3.  **Network Transport:** A fetch request is made to `/api/ai/chat`, configured to receive Server-Sent Events (SSE).
4.  **Backend Processing:**
    - The controller fetches conversation history from `AIMemory`.
    - It calls `buildAssistantPrompt` to generate the exact prompt.
    - It calls `generateContentStream` from the AI service.
5.  **Streaming:** 
    - As Gemini streams chunks back to the backend, the backend forwards them to the client using `res.write()`.
6.  **UI Update:** 
    - The client's `onmessage` handler receives chunks and updates Zustand's `activeStreamText`.
    - React re-renders rapidly, creating a typing effect.
7.  **Completion:** The stream closes, the final text is saved to MongoDB, and `isGenerating` is set to `false`.
