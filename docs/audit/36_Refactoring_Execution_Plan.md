# Refactoring Execution Plan: IoT Copilot AI (Updated)

This document is the master checklist for all refactoring and cleanup changes. It prioritizes **stability, maintainability, readability, performance, and production readiness** while strictly avoiding any major architectural migrations.

---

## SAFETY RULES & WORKFLOW

Every single phase MUST adhere to the following strict workflow:
1. Make only the changes for the current phase.
2. Build the client (`npm run build` in `client`).
3. Build the server (`npm run build` in `server`).
4. Run lint (`npm run lint` in both).
5. Run type checking (`tsc --noEmit` in both).
6. Start the application (`npm run dev`).
7. Test all affected features in the browser.
8. Verify nothing else has broken.
9. Commit the phase only after all tests pass.

**Rollback Policy:** If any phase introduces regressions, stop immediately, log the issue, and roll back the commit. Do not proceed to the next phase until the regression is understood and fixed.

---

## EXECUTION PHASES

### Phase 1: Remove Unused Dependencies
- **Goal:** Strip out bloat from `client` and `server` package.json files.
- **Files Affected:** `server/package.json`, `client/package.json`, `package-lock.json`
- **Expected Risks:** Very Low.
- **Rollback Strategy:** Run `git checkout package.json package-lock.json && npm install`.
- **Difficulty:** Easy
- **Estimated Time:** 5 minutes
- **Prerequisites:** None.
- **Verification Checklist:**
  - Uninstall `@types/bcryptjs`, `@types/cookie-parser`, `@types/jsonwebtoken` in `server/`.
  - Uninstall `@tanstack/react-query`, `@tanstack/react-query-devtools`, `axios` in `client/`.

### Phase 2: Remove Unused Imports
- **Goal:** Clean up all files by removing unused import statements identified by ESLint/TypeScript.
- **Files Affected:** Global (Client & Server).
- **Expected Risks:** Low.
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Easy
- **Estimated Time:** 15 minutes

### Phase 3: Remove Dead Code
- **Goal:** Remove orphaned interfaces and unused function declarations (excluding active AI prompts).
- **Files Affected:** `server/src/models/*.ts`, `client/src/components/**/*.tsx`.
- **Expected Risks:** Low.
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Easy
- **Estimated Time:** 20 minutes

### Phase 4: Remove Obsolete Files
- **Goal:** Delete scratchpads, backup `.env` files, or unused placeholder assets in `public/`.
- **Files Affected:** `client/public/`, root directory.
- **Expected Risks:** Very Low.
- **Rollback Strategy:** Restore from git.
- **Difficulty:** Easy
- **Estimated Time:** 5 minutes

### Phase 5: Consolidate Duplicate Types
- **Goal:** Consolidate redundant manual TypeScript interfaces into inferred types from schemas where possible, keeping the folders separate.
- **Files Affected:** `server/src/types`, `client/src/types`.
- **Expected Risks:** Medium. Changing type definitions can cause cascading compilation errors.
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Medium
- **Estimated Time:** 30 minutes

### Phase 6: Consolidate Duplicate Schemas
- **Goal:** Ensure Zod schemas in `server/src/validators` perfectly match `client/src/utils/validation.ts` to prevent runtime API mismatches.
- **Files Affected:** Schema files in both client and server.
- **Expected Risks:** Medium. Form validation might break if schemas are updated incorrectly.
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Medium
- **Estimated Time:** 30 minutes

### Phase 7: Improve Naming Consistency
- **Goal:** Enforce standard naming conventions (e.g., camelCase for variables, PascalCase for components) across the stack.
- **Files Affected:** Global.
- **Expected Risks:** Medium. Renaming exports requires updating imports everywhere.
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Medium
- **Estimated Time:** 30 minutes

### Phase 8: Simplify Utilities
- **Goal:** Refactor bloated utility functions into single-responsibility helpers.
- **Files Affected:** `client/src/utils/`, `server/src/utils/`.
- **Expected Risks:** Low.
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Easy
- **Estimated Time:** 20 minutes

### Phase 9: Simplify Services
- **Goal:** Extract large service methods (especially in `ai.ts`) into smaller, testable sub-modules.
- **Files Affected:** `server/src/services/`.
- **Expected Risks:** Medium.
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Medium
- **Estimated Time:** 45 minutes

### Phase 10: Optimize API Layer
- **Goal:** Clean up controller logic, moving any remaining business logic to services, and standardizing error handling.
- **Files Affected:** `server/src/controllers/`, `server/src/routes/`.
- **Expected Risks:** High. Modifying API routes risks breaking client-side fetches.
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Medium
- **Estimated Time:** 45 minutes

### Phase 11: Optimize AI Layer
- **Goal:** Fine-tune system prompts to reduce token usage and improve response accuracy.
- **Files Affected:** AI prompt definitions.
- **Expected Risks:** Low (code stability), Medium (response quality).
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Easy
- **Estimated Time:** 30 minutes

### Phase 12: Database Optimization
- **Goal:** Ensure all Mongoose schemas have appropriate indexes on queried fields.
- **Files Affected:** `server/src/models/`.
- **Expected Risks:** Low.
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Easy
- **Estimated Time:** 15 minutes

### Phase 13: Performance Optimization
- **Goal:** Improve Lighthouse scores (e.g., lazy loading images, optimizing fonts).
- **Files Affected:** `client/src/app/`, `client/src/components/`.
- **Expected Risks:** Low.
- **Rollback Strategy:** Revert git commit.
- **Difficulty:** Easy
- **Estimated Time:** 30 minutes

### Phase 14: Final QA
- **Goal:** A complete, end-to-end manual and automated testing sweep of the entire application.
- **Verification:** Run all build and dev commands. Test full user flows.

---

## Future Roadmap: Monorepo Migration
*(Note: This architectural change has been explicitly postponed to prioritize stability. It is listed here solely for future planning).*
Migrating the `client` and `server` directories into an NPM Workspace Monorepo with a shared `packages/common` folder will eventually provide a single source of truth for all types and schemas, eliminating the need for Phase 5 & Phase 6 manual synchronization.
