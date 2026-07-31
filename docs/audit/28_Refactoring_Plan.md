# Refactoring & Cleanup Plan: IoT Copilot AI

This document provides a safe, step-by-step strategy for executing the cleanup identified in the previous reports, and outlines architectural refactoring to improve maintainability. 

***DO NOT execute these steps blindly. Verify each step in a local development environment.***

---

## Phase 1: Dependency Pruning
*Goal: Remove unused code that poses zero risk to application logic.*

**Step 1: Backend DevDependencies**
1. Navigate to the `server/` directory.
2. Run: `npm uninstall -D @types/bcryptjs @types/cookie-parser @types/jsonwebtoken`
3. Run the server (`npm run dev`) and ensure no TypeScript compilation errors occur.

**Step 2: Frontend Audit**
1. Search the `client/src` directory for `axios`. If no usage is found, run `npm uninstall axios` in the `client/` directory.
2. Search the `client/src` directory for `useQuery`. If no usage is found, run `npm uninstall @tanstack/react-query @tanstack/react-query-devtools`.
3. Build the client (`npm run build`) to ensure the Next.js compiler doesn't throw module resolution errors.

---

## Phase 2: Structural Refactoring (The Monorepo Transition)
*Goal: Eliminate duplicated Types and Zod schemas between the client and server.*

Currently, if the database schema for a `Project` changes, the developer must manually update:
1. `server/src/models/Project.ts` (Mongoose Schema)
2. `server/src/validators/project.ts` (Zod Schema)
3. `client/src/utils/validation.ts` (Client Zod Schema)
4. `client/src/types/index.ts` (TypeScript interfaces)

**Step 1: Setup NPM Workspaces**
1. Move the `client/` and `server/` directories into an `apps/` directory.
2. Create a `packages/common/` directory.
3. Create a root `package.json` defining the workspaces:
   ```json
   {
     "name": "iot-copilot-workspace",
     "private": true,
     "workspaces": ["apps/*", "packages/*"]
   }
   ```

**Step 2: Migrate Shared Logic**
1. Move all Zod schemas into `packages/common/src/schemas.ts`.
2. Move all shared TypeScript interfaces into `packages/common/src/types.ts`.
3. Export them from a central `packages/common/src/index.ts`.
4. Compile the `common` package using `tsc`.

**Step 3: Wire Dependencies**
1. In `apps/client/package.json` and `apps/server/package.json`, add the local dependency:
   `"iot-copilot-common": "*"`
2. Update imports across the codebase. Change `import { projectSchema } from '../utils/validation'` to `import { projectSchema } from 'iot-copilot-common'`.

---

## Phase 3: Codebase Micro-Refactorings
*Goal: Improve readability and separation of concerns.*

1. **Extract AI Prompts:** The `server/src/services/ai.ts` file is likely very large. Extract the string-template logic (e.g., `buildMentorPrompt`) into a dedicated `server/src/services/prompts/` directory. Keep only the API invocation logic in `ai.ts`.
2. **Centralize Error Messages:** Replace hardcoded error strings in controllers (e.g., `res.status(404).json({ message: "Project not found" })`) with constant variables imported from `utils/constants.ts` to ensure UI consistency.
3. **Zustand Splitting:** Ensure `client/src/store/aiStore.ts` does not contain business logic. Moving complex data transformation out of the store and into utility functions will make the store easier to test.
