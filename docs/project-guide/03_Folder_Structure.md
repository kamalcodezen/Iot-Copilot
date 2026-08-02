# 03. Folder Structure

## Purpose
This document explains the physical organization of the repository and the domain-driven rules for the frontend and backend.

## When to read
Read this when creating a new file, adding a new feature, or trying to locate where specific logic belongs.

## Related documents
- [02. Architecture](./02_Architecture.md)

## Table of Contents
- [1. Root Folder Structure](#1-root-folder-structure)
- [2. Frontend Structure (`client/`)](#2-frontend-structure-client)
- [3. Backend Structure (`server/`)](#3-backend-structure-server)

## Main Content

### 1. Root Folder Structure
```text
Iot-copilot/
├── client/                 # Next.js Frontend
├── server/                 # Express Backend
├── docs/                   # Documentation and Project Guides
└── package.json            # Root workspace config
```

### 2. Frontend Structure (`client/`)

- **`app/`**: Contains Next.js page routes, layouts, and global CSS.
  - *Rule:* Only route definitions and page assembly should happen here. Complex logic belongs in `features/`.
- **`features/`**: Domain-specific modules (e.g., `ai/`, `projects/`, `dashboard/`).
  - *Rule:* Each feature should contain its own `components/` if they are highly specific to that feature. Features should not deeply import from each other.
- **`components/`**: Global, reusable UI components.
  - **`ui/`**: Generic, headless or highly styled atomic components (e.g., Buttons, Inputs).
  - **`layout/`**: Structural components (e.g., Navbar, Sidebar).
- **`lib/`**: Core networking and utility logic.
  - **`api/`**: Server-side Data Fetching (Queries) helper functions (e.g., `project.ts`, `ai.ts`).
  - **`actions/`**: Next.js Server Actions (Mutations).
  - **`core/`**: Core utilities, specifically `server.ts` for customized fetch logic.
- **`store/`**: Zustand global state management.
- **`utils/`**: General helper functions (e.g., formatting dates, classes).
- **`types/`**: Global TypeScript interfaces (e.g., `api.ts`, `user.ts`).

#### Adding New Features
1. Create a folder under `features/[feature-name]/`.
2. Inside, create subdirectories like `components/`, `hooks/`, `types.ts` if needed.
3. Use the feature components inside `app/` routes.

### 3. Backend Structure (`server/`)

- **`controllers/`**: Extracts data from HTTP requests (`req.body`, `req.query`), invokes the relevant Service, and formats the HTTP response (`res.json()`).
- **`routes/`**: Connects HTTP methods and paths to Controllers. Attaches middlewares.
- **`middlewares/`**: Request interceptors. Includes `auth` (Better Auth integration), `validate` (Zod schema checking), and `errorHandler`.
- **`services/`**: The core business logic layer. Performs DB operations via Models and interacts with external APIs (like Gemini).
- **`models/`**: Mongoose schemas defining the MongoDB collections.
- **`validators/`**: Zod schemas used by the validation middleware to sanitize incoming data.
- **`config/`**: Setup logic for the application (e.g., MongoDB connection, Better Auth config).
- **`types/`**: TypeScript interfaces and types for the backend scope.
- **`utils/`**: Helper utilities (e.g., `logger.ts`, `ApiResponse.ts`).

## Related Source Code
- `client/src/*`
- `server/src/*`

## Last Updated
2026-08-02
