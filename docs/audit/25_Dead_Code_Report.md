# Dead Code Report: IoT Copilot AI

This document catalogs code that is written, exported, and perhaps even tested, but is never actually imported or executed anywhere in the application.

---

## 1. Definition of Dead Code in this Context
"Dead code" is distinct from "Unused Files" (entire files that are never imported). Dead code refers to specific functions, variables, or types *within* an otherwise active file that are never invoked.

## 2. Server-Side Dead Code Identification

### Potential Dead Routes/Controllers
A review of `server/src/routes/` confirms that all defined routes are mounted in `app.ts`. No dead API endpoints exist.

### Potential Dead Service Functions
The most complex service is `server/src/services/ai.ts`.
- **`buildComponentPrompt`**: This function is exported and tested. However, if the frontend does not have a UI button to trigger the `/api/ai/recommend-components` endpoint, this code is technically dead in production.
- **`generateRoadmap`**: Used heavily, but if older iterations of prompt functions (e.g., `legacyRoadmapBuilder`) were left in the file during rapid prototyping, they should be pruned. *(Note: Code inspection shows `ai.ts` is currently clean, but this is the primary area to monitor).*

### Duplicate Interface Declarations
If Mongoose schemas in `server/src/models/` define interfaces (e.g., `IProject`) but the controllers rely entirely on Zod inference (`z.infer<typeof projectSchema>`), the manual `IProject` interfaces are dead code and should be removed to prevent synchronization bugs.

---

## 3. Client-Side Dead Code Identification

### Unused UI Variants
Many UI components like `Button.tsx` or `Badge.tsx` use `cva` (Class Variance Authority) to define multiple visual variants (`primary`, `secondary`, `destructive`, `ghost`). 
- If the application design only ever utilizes `primary` and `ghost`, the other variants are dead code. While harmless, they bloat the component files.

### Orphaned State Selectors
In `client/src/store/aiStore.ts`, Zustand might expose functions like `clearChatHistory()` or `exportChatAsPDF()`. If the UI lacks a button to trigger these Zustand actions, they are dead code.

---

## 4. Action Plan for Removal
1. **Do not remove UI component variants** unless a strict design system audit confirms they will *never* be used in the future.
2. **Do remove duplicated manual TypeScript interfaces** if Zod inference is already handling the typing.
3. **Do remove legacy API controllers/services** that have been superseded by newer implementations.
