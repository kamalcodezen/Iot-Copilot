# Frontend Documentation

The frontend is a Next.js application using the App Router, located in `client/`.

## Directory Structure & Rules

- **`app/`**: Contains Next.js page routes, layouts, and global CSS.
  - *Rule:* Only route definitions and page assembly should happen here. Complex logic belongs in `features/`.
- **`features/`**: Domain-specific modules (e.g., `ai/`, `projects/`, `dashboard/`).
  - *Rule:* Each feature should contain its own `components/` if they are highly specific to that feature. Features should not deeply import from each other.
- **`components/`**: Global, reusable UI components.
  - **`ui/`**: Generic, headless or highly styled atomic components (e.g., Buttons, Inputs).
  - **`layout/`**: Structural components (e.g., Navbar, Sidebar).
- **`lib/`**: Core networking and utility logic.
  - **`api/`**: Typed helper functions wrapping network calls (e.g., `project.ts`, `ai.ts`).
  - **`actions/`**: Next.js Server Actions (if used).
  - **`core/`**: Core utilities, specifically `server.ts` for customized fetch logic.
- **`utils/`**: General helper functions (e.g., formatting dates, classes).
- **`types/`**: Global TypeScript interfaces (e.g., `api.ts`, `user.ts`).

## Adding New Pages
1. Create a folder in `app/` matching the desired route (e.g., `app/settings/`).
2. Add a `page.tsx` file inside the folder.
3. Import required components from `features/` or `components/`.

## Adding New Features
1. Create a folder under `features/[feature-name]/`.
2. Inside, create subdirectories like `components/`, `hooks/`, `types.ts` if needed.
3. Use the feature components inside `app/` routes.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [ARCHITECTURE.md](./ARCHITECTURE.md), [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- **Revision History:** Initial release (v1.0.0)
