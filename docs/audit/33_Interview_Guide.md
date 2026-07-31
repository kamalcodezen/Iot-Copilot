# Interview Guide: IoT Copilot AI Architecture

This document is designed to help engineers understand the technical decisions made in this repository. If you are interviewing for a role to maintain this codebase, or just want to understand the "why" behind the code, read this.

---

## 1. Why decouple the frontend and backend instead of using Next.js Server Actions?

**Question:** Next.js 15+ heavily promotes Server Actions and full-stack capabilities within the `app/` router. Why does this project use a separate Express server?

**Answer:** 
1. **Long-Lived Connections:** The AI Mentor relies heavily on Server-Sent Events (SSE) for streaming text chunks in real time. While Next.js Edge Functions can handle streaming, a dedicated Express Node.js instance provides finer control over long-lived socket connections, timeouts, and memory management during complex AI generations.
2. **Hardware Integrations:** Future iterations of this project may require raw TCP/UDP socket connections (e.g., listening to an MQTT broker directly on the server). Express makes this drastically easier than Vercel serverless functions.
3. **Separation of Concerns:** Keeping the business logic entirely independent of the UI framework allows us to eventually build a mobile app (React Native) that hooks into the exact same Express API without needing to duplicate logic.

## 2. Why Better Auth instead of NextAuth/Auth.js?

**Question:** NextAuth is the industry standard for Next.js. Why did you choose Better Auth?

**Answer:** 
NextAuth tightly couples authentication to the Next.js framework. Because our backend is a separate Express server, we needed an authentication library that works natively in Express (to protect the `/api/*` routes) while still providing a modern, type-safe client for React. Better Auth achieves exactly this. It runs on the Express server, manages the MongoDB user table directly, and sets HTTP-only cookies that the separate Next.js client seamlessly attaches to requests via Axios `withCredentials`.

## 3. Why Zustand instead of Redux or Context API?

**Question:** How do you manage global state, and why didn't you use Redux?

**Answer:** 
1. **Server State:** Most of the data in this app (Projects, Users, Activity) is Server State. We use **TanStack React Query** for this because it handles caching, background refetching, and invalidation out-of-the-box. Redux is terrible at Server State without heavy middlewares like RTK Query.
2. **Client State:** The only truly global Client State is UI toggles (e.g., `isSidebarOpen`) and the AI Chat active stream. React Context causes unnecessary re-renders of the entire DOM tree if not perfectly memoized. Redux requires too much boilerplate. Zustand is extremely lightweight, uses hooks natively, and solves the re-render issue elegantly.

## 4. How does the AI context injection work?

**Question:** When a user asks "Why is my code failing?", how does the AI know what code they are talking about?

**Answer:** 
We designed a stateless context injection system. The frontend `<AIAssistant>` component monitors the current URL path. 
- If the user is on `/projects/123`, the component extracts `123`.
- When the user sends a chat message, the frontend silently appends `{ projectId: '123' }` to the API request payload.
- The backend Express controller intercepts this, queries MongoDB for Project 123, extracts the C++ code and circuit description, and injects it into a hidden System Prompt before sending it to the Google Gemini API. 
- To the user, it feels like the AI is "looking" at their screen. To the system, it's just dynamic string concatenation in the `server/src/services/ai.ts` file.
