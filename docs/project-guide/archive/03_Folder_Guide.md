# 03. Folder Guide

This guide breaks down every folder in both the `client` and `server` repositories, explaining their purpose, contents, and interactions.

## 1. Client Folder Structure (`client/`)

The frontend relies heavily on a feature-based architectural pattern inside a Next.js App Router setup.

### `client/src/app`
- **Purpose:** Next.js App Router directory. Defines all routes and pages.
- **Contents:** `page.tsx` (route UIs), `layout.tsx` (route layouts), `globals.css` (global styles), and `api/` (Next.js serverless functions, though most are proxied).
- **Interactions:** Imports domain logic from `features/` and UI from `components/`. It's the entry point for what the user actually sees.

### `client/src/features`
- **Purpose:** Domain-driven encapsulation. Groups logic by business feature rather than file type.
- **Contents:**
  - `ai/`: Contains ChatContainer, Debugger, Interview Coach, and Mentor logic.
  - `dashboard/`: Contains ProgressChart, SkillRadar, StatsBar, and QuickActions for the main dashboard view.
  - `landing/`: Hero, CTA, RoadmapPreview, and FAQ components for the public-facing homepage.
  - `projects/`: ProjectForm, ProjectTimeline, and ProjectCard for managing IoT build projects.
- **Interactions:** Exports specific `<Component />`s used directly by pages in `app/`. Keeps `app/` clean.

### `client/src/components`
- **Purpose:** Highly reusable, domain-agnostic UI elements.
- **Contents:** `ui/Button`, `ui/Card`, `ui/Input`, `layout/Navbar`, `layout/Footer`.
- **Interactions:** Used everywhere. If a button is needed in a feature, it's imported from here to maintain a unified design system.

### `client/src/lib`
- **Purpose:** Third-party integrations, API wrappers, and client configurations.
- **Contents:** `auth-client.ts` (Better Auth initialization), `api/` (Fetch wrappers like `client-api.ts` and `ai-stream.ts`).
- **Interactions:** Provides the raw data and auth mechanisms to the rest of the app.

### `client/src/store`
- **Purpose:** Global state management via Zustand.
- **Contents:** `authStore.ts` (syncs Better Auth state with React).
- **Interactions:** Hooks are imported by `Navbar`, `SettingsPage`, and `Dashboard` to check `user` and `isAuthenticated` status.

### `client/src/types`
- **Purpose:** Global TypeScript interfaces.
- **Contents:** `index.ts` (Models like `Project`, `Activity`, `StatsData`).

### `client/src/utils`
- **Purpose:** Pure utility functions.
- **Contents:** `cn.ts` (Tailwind class merging), `date.ts` (date formatting).

---

## 2. Server Folder Structure (`server/`)

The backend follows a classic Express.js MVC (Model-View-Controller) pattern, adapted for an API-first approach.

### `server/src/config`
- **Purpose:** Environment and database initialization.
- **Contents:** `db.ts` (Mongoose connection logic), `env.ts` (environment variable validation).
- **Interactions:** Called by `server.ts` on startup.

### `server/src/controllers`
- **Purpose:** Request handling and orchestration.
- **Contents:** `aiController.ts`, `projectController.ts`, `dashboardController.ts`.
- **Interactions:** Receives `req`, extracts data, calls `services/`, and sends `res.json()`.

### `server/src/models`
- **Purpose:** MongoDB schemas (Mongoose).
- **Contents:** `User.ts`, `Project.ts`, `Activity.ts`.
- **Interactions:** Used by controllers and services to query or mutate database state.

### `server/src/routes`
- **Purpose:** API endpoint definitions.
- **Contents:** `aiRoutes.ts`, `projectRoutes.ts`, `dashboardRoutes.ts`.
- **Interactions:** Maps HTTP verbs (`GET`, `POST`) to specific methods in the `controllers/`. Mounted by `app.ts`.

### `server/src/services`
- **Purpose:** Complex business logic and third-party API interactions.
- **Contents:** `ai.ts` (Google Gemini SDK implementation, prompt formatting, stream generation).
- **Interactions:** Called by `controllers/` to keep controllers thin and testable.

### `server/src/middlewares`
- **Purpose:** Request interception for security, validation, and auth.
- **Contents:** `auth.ts` (Validates Better Auth sessions), `error.ts` (Global error handling).
- **Interactions:** Injected into `routes/` before controllers execute.

### `server/src/validators`
- **Purpose:** Zod schemas for validating incoming request bodies.
- **Contents:** `project.validator.ts`.

### `server/src/types`
- **Purpose:** Server-specific TypeScript definitions.
- **Contents:** Custom `express` request extensions.

## Root Level
- `docs/project-guide/`: The official project bible containing all architectural documentation.
