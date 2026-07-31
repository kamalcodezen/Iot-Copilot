# Cleanup Report: IoT Copilot AI

This document provides a holistic overview of the cleanup activities required across the codebase. It acts as an executive summary for the more detailed dead code, unused files, and unused dependencies reports.

---

## 1. Primary Areas for Cleanup

Based on the comprehensive codebase audit, the project is remarkably clean but has accumulated technical debt in three specific areas:
1.  **Redundant Type Definitions:** Better Auth handles its own typings, leaving several manual `@types/*` packages orphaned on the backend.
2.  **Duplicated Validation Logic:** Zod schemas exist on both the client (`client/src/utils/validation.ts`) and the server (`server/src/validators/`). 
3.  **Monorepo Restructuring (Recommended):** The current `client/` and `server/` split is standard, but the duplicated types and schemas strongly suggest moving to an `npm workspace` or `pnpm workspace` to share a `packages/common` directory.

## 2. Safe to Remove Items (Summary)

The following items have been identified as completely safe to remove without impacting production functionality:
-   `@types/bcryptjs`, `@types/cookie-parser`, `@types/jsonwebtoken` from `server/package.json`.
-   Any duplicated Zod schemas on the client if a shared workspace is implemented.

## 3. Items Requiring Verification Before Removal

The `depcheck` tool flagged `@tanstack/react-query` and `axios` on the client. **It is NOT safe to remove these blindly.** Next.js App Router applications often obscure imports from dependency checkers due to absolute imports (e.g., `@/lib/axios`). 
-   **Action:** A manual grep must be performed for `useQuery`, `useMutation`, and `axios.get` before these are removed. If they are truly unused, it implies the frontend is currently relying entirely on Next.js Server Actions or `fetch`, which contradicts the architectural design.

## 4. Next Steps
Do not delete anything yet. Review the `28_Refactoring_Plan.md` for the exact step-by-step sequence to safely execute this cleanup.
