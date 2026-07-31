# State Management Documentation: IoT Copilot AI

This document explains the division of state in the frontend application and why specific tools were chosen.

## 1. Server State vs. Client State

The architectural philosophy of this project strictly separates "Server State" from "Client State".

- **Server State:** Data that lives in MongoDB (e.g., User Profile, Projects, Activity Logs). It is asynchronous, can be modified by other users, and can become stale.
- **Client State:** Data that lives entirely in the browser's memory (e.g., "Is the sidebar open?", "What text is currently in the chat input?", "Is the dark mode toggle on?").

---

## 2. Server State Management: TanStack React Query

**Library:** `@tanstack/react-query`

### Why React Query?
Instead of manually fetching data with `useEffect` and storing it in React `useState` (which leads to race conditions, complex loading/error state management, and stale data), React Query handles all of this automatically.

### How it works:
- **Queries:** When a user visits `/dashboard`, a hook like `useActivityStats()` fires. React Query checks its cache. If the data is missing or stale, it fetches from `/api/activities/stats`. While fetching, it provides a simple `isLoading` boolean to render a spinner.
- **Mutations:** When a user creates a project, a mutation fires. On success, the mutation automatically invalidates the `['projects']` cache key. This forces React Query to refetch the project list in the background, updating the UI instantly without needing a full page reload.

---

## 3. Client State Management: Zustand

**Library:** `zustand`

### Why Zustand?
React's built-in Context API is prone to performance issues if not memoized perfectly, as updating a Context value forces a re-render of every component consuming it. Redux is too boilerplate-heavy for this project's needs. Zustand provides a fast, unopinionated, global state manager using hooks.

### How it works:
Zustand creates independent "stores" in `client/src/store/`.
- **`uiStore.ts`**: Holds booleans for UI elements that transcend page boundaries (e.g., `isAIAssistantOpen`).
- **`authStore.ts`**: Holds the current user's profile and authentication status, fetched once on mount.
- **`aiStore.ts`**: Holds the rapid state changes required for streaming AI responses (which would cause too many re-renders if held in React Query).

---

## 4. Local State: React `useState` / `useReducer`

For state that does not need to be shared globally (e.g., an accordion being open, a tab being selected, or local form input before submission), standard React `useState` is used.

### Forms: React Hook Form
For complex forms (like the Project Planner wizard), `react-hook-form` is used instead of standard controlled inputs. This prevents the entire form from re-rendering on every keystroke, vastly improving performance.
