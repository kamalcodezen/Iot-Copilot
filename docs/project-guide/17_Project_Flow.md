# 17. Project Flow

This document details the complete end-to-end user and technical flow for interacting with the IoT Copilot ecosystem.

## 1. Initial Access & Landing
- **Action:** User navigates to `https://[domain].com/`.
- **Flow:**
  1. Next.js App Router matches `/` and renders `client/src/app/page.tsx`.
  2. The `Hero` and `Navbar` components verify authentication status via `useAuthStore`.
  3. If unauthenticated, the user sees "Login" and "Register" CTAs.
  4. Framer Motion triggers entry animations on the SVG network map (with fallbacks to prevent `undefined` SVG radius errors).

## 2. Authentication & Onboarding
- **Action:** User clicks "Register".
- **Flow:**
  1. User is routed to `/auth/register`.
  2. User fills out Name, Email, and Password. Zod schema validation runs locally in `register/page.tsx`.
  3. Form submits calling `authClient.signUp.email()`.
  4. Better Auth (on the server) hashes the password, creates a MongoDB User document, and sets a Secure HTTP-Only Cookie.
  5. The client triggers `fetchMe()` in `useAuthStore` to pull the session context.
  6. User is redirected to `/dashboard`.

## 3. The Dashboard Experience
- **Action:** User arrives at `/dashboard`.
- **Flow:**
  1. `DashboardPage` mounts and triggers two API calls concurrently: `getDashboardStats()` and `fetchAI()` (for recommendations).
  2. Data returns and hydrates:
     - `StatsBar` (Total projects, hours, streak)
     - `ProgressChart` (Recharts LineChart plotting activity over 30 days)
     - `ProjectProgress` (List of active projects)
  3. If AI Recommendations error out, the UI catches it gracefully without crashing the main dashboard.

## 4. Chatting with the AI Mentor
- **Action:** User clicks "AI Mentor" in the sidebar and types a question.
- **Flow:**
  1. User is routed to `/ai-mentor`.
  2. `ChatContainer` adds the user's message to the local UI state and sets `isStreaming = true`.
  3. `ai-stream.ts` sends a POST request to `/api/ai/chat` via fetch.
  4. The Express server (`aiController.ts`) validates the request and passes it to `aiService.ts`.
  5. `aiService.ts` wraps the user prompt with system instructions ("You are a Senior IoT Engineer...") and calls the Gemini SDK.
  6. Gemini returns a stream. The Express server pipes this stream back to the client.
  7. The client decodes the stream chunk-by-chunk, appending it to the AI's message bubble in real-time.

## 5. Project Planning
- **Action:** User clicks "Create Project" -> "Generate with AI".
- **Flow:**
  1. User fills out a form specifying their desired IoT project (e.g., "Smart Garden").
  2. Client sends POST to `/api/ai/plan`.
  3. The server prompts Gemini to generate a JSON response matching the `Project` schema.
  4. Once generated, the server saves the new `Project` document in MongoDB and returns the ID.
  5. Client redirects the user to `/projects/[id]`.
  6. User views their generated milestones, hardware list, and architectural recommendations.

## 6. Account Settings & Logout
- **Action:** User navigates to Settings to update their name, then logs out.
- **Flow:**
  1. `SettingsPage` calls `authClient.updateUser({ name })` directly against Better Auth.
  2. A successful update triggers a re-fetch of the session to update the Navbar avatar instantly.
  3. User clicks "Sign Out".
  4. `useAuthStore.logout()` invokes `authClient.signOut()`, destroying the session cookie.
  5. User is redirected back to the Landing Page.
