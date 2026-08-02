# 06. Page Guide

This guide maps out the Next.js App Router structure in `client/src/app`.

## 1. Public Pages

### `app/page.tsx` (Landing Page)
- **Route:** `/`
- **Purpose:** The marketing and entry point of the application.
- **UI Flow:** Displays the `Hero` (with SVG animations), `Features`, `RoadmapPreview`, `FAQ`, and `CTA` components.
- **API Calls:** None. Fully static/client-rendered UI.
- **Business Logic:** Redirects to `/dashboard` if a user attempts to access it while already logged in.

### `app/auth/login/page.tsx`
- **Route:** `/auth/login`
- **Purpose:** User authentication.
- **API Calls:** Calls `authClient.signIn.email()`.
- **UI Flow:** Renders a glassmorphic login card. Upon success, redirects to `/dashboard`.

### `app/auth/register/page.tsx`
- **Route:** `/auth/register`
- **Purpose:** User registration.
- **API Calls:** Calls `authClient.signUp.email()`.

---

## 2. Protected Pages

### `app/dashboard/page.tsx`
- **Route:** `/dashboard`
- **Purpose:** The central hub for authenticated users.
- **API Calls:** `GET /api/dashboard/stats`, `GET /api/dashboard/activities`, `GET /api/ai/recommend`.
- **UI Flow:** Shows `StatsBar` at the top, followed by a grid containing `ProgressChart`, `SkillRadar`, `ProjectProgress`, and `RecentActivity`.

### `app/projects/page.tsx`
- **Route:** `/projects`
- **Purpose:** Lists all projects owned by the user.
- **API Calls:** `GET /api/projects`.
- **UI Flow:** Grid of `ProjectCard` components. Contains a "Create Project" button.

### `app/projects/new/page.tsx`
- **Route:** `/projects/new`
- **Purpose:** Allows creation of new projects.
- **Business Logic:** Offers two paths: Manual Form (creates empty project) or AI Generator (prompts Gemini to architect a project).

### `app/projects/[id]/page.tsx`
- **Route:** `/projects/:id`
- **Purpose:** Details view for a specific project.
- **API Calls:** `GET /api/projects/:id`.
- **UI Flow:** Displays description, hardware list, and the `ProjectTimeline` showing milestones.

### `app/settings/page.tsx`
- **Route:** `/settings`
- **Purpose:** Account management.
- **API Calls:** `authClient.updateUser()`, `authClient.changePassword()`.
- **Business Logic:** Strictly utilizes Better Auth for profile updates. No custom backend logic is involved in updating basic user data.

---

## 3. AI Modules

### `app/ai-mentor/page.tsx`
- **Route:** `/ai-mentor`
- **Purpose:** Conversational interface with the Gemini-powered Mentor.
- **API Calls:** POST to `/api/ai/chat` (streaming).

### `app/ai-debugger/page.tsx`
- **Route:** `/ai-debugger`
- **Purpose:** Specialized tool for pasting logs and code.
- **API Calls:** POST to `/api/ai/debug`.

### `app/learning-path/page.tsx`
- **Route:** `/learning-path`
- **Purpose:** Gamified progression tree for IoT topics.
- **UI Flow:** Displays nodes like "Basic Sensors", "MQTT Protocols", and "Edge Computing". Clicking a node opens an AI-generated micro-lesson.
