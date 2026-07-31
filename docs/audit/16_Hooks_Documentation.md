# Custom Hooks Documentation: IoT Copilot AI

This document details the custom React hooks used within the client application. Because the project uses **Zustand** and **TanStack React Query**, most custom hooks are wrappers around these state managers.

---

## 1. Zustand Store Hooks (`client/src/store/`)

Zustand provides a very lightweight API for creating custom hooks that manage global state. 

### `useAuthStore` (`authStore.ts`)
- **Purpose:** Manages the client-side authentication state.
- **Problem solved:** Prevents prop-drilling the user object to every component that needs to know if a user is logged in.
- **Responsibilities:** 
  - Holds `user` (data object) and `isAuthenticated` (boolean).
  - Likely exposes actions like `login()`, `logout()`, and `updateUser()` which internally call the Better Auth API and update the local store upon success.

### `useUIStore` (`uiStore.ts`)
- **Purpose:** Manages ephemeral UI state that needs to be accessed globally.
- **Problem solved:** Handling UI elements that are mounted in the root `layout.tsx` but controlled from deeply nested pages.
- **Responsibilities:**
  - `isAIAssistantOpen`: Controls the visibility of the global AI floating window.
  - `isSidebarOpen`: Controls the mobile navigation drawer.
  - Exposes toggle functions (`toggleAIAssistant`, `closeSidebar`).

### `useAIStore` (`aiStore.ts`)
- **Purpose:** Manages the state of the active AI chat session.
- **Problem solved:** When streaming SSE responses, the text arrives in chunks. Managing this in local component state can lead to performance issues or lost text on re-renders.
- **Responsibilities:**
  - Holds `messages` (array of chat bubbles).
  - Holds `isGenerating` (boolean for loading spinners).
  - Holds `activeStreamText` (the currently streaming chunk).

---

## 2. React Query Hooks

While there is no dedicated `/hooks` folder, the application likely utilizes custom hooks wrapping `useQuery` and `useMutation` inside the `features` or `services` directories.

- **Data Fetching Hooks:** Wrappers around Axios calls to the backend (e.g., `useProjects()` to fetch all projects). These abstract away the query keys and cache invalidation logic.
- **Mutation Hooks:** Wrappers for POST/PUT requests (e.g., `useCreateProject()`). These typically include an `onSuccess` callback that invalidates the corresponding query cache (e.g., calling `queryClient.invalidateQueries('projects')`) so the UI updates immediately after a successful creation.

---

## Evaluation & Recommendations

- **Clean Architecture:** By relying on Zustand and React Query, the application avoids the "Context API Hell" (deeply nested providers causing unnecessary re-renders). 
- **Improvement:** If React Query hooks are currently scattered inside components, it is recommended to extract them into a centralized `client/src/hooks/queries` folder. This makes it easier to track query keys and reuse data-fetching logic across different pages.
