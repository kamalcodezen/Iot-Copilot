# Client Documentation: IoT Copilot AI

This document provides a holistic view of the client-side application. 

## Overview
The frontend is built using **Next.js 16 (App Router)** and **React 19**. It is styled with **Tailwind CSS v4** and uses **Framer Motion** for micro-animations to create a premium, dynamic feel. 

---

## 1. Routing & Layouts (`client/src/app`)

Next.js App Router uses the filesystem to define routes. 
- **`layout.tsx` (Root Layout):** This is the main wrapper for the entire application. It sets up the global fonts (`Inter` for sans, `JetBrains Mono` for monospace) and manages the HTML/Body tags. 
  - **Global Providers:** It includes `ToastProvider` (react-hot-toast) for notifications.
  - **Global UI Elements:** It injects the `Navbar` and the `AIAssistant` component, ensuring the AI is globally accessible regardless of the page the user is on.
- **`page.tsx` (Root Page):** The landing page of the application.
- **Nested Routes:** Each folder (e.g., `dashboard/`, `projects/`) acts as a route, containing its own `page.tsx` and potentially local `layout.tsx` files.

## 2. Global State Management

Global state is managed primarily via two tools:
- **TanStack React Query:** Used for server state. It handles fetching, caching, and updating asynchronous data from the Express backend (e.g., fetching a user's projects).
- **Zustand:** Used for client UI state. The application uses small, focused stores (e.g., managing the open/closed state of the global AI Assistant or holding temporary form data during multi-step wizards).

## 3. Theming & Styling

- **Tailwind CSS v4:** Uses the new PostCSS-based engine. Global styles and custom Tailwind variables are defined in `globals.css`. The application uses a custom color palette tailored for a sleek, modern, "dashboard" aesthetic (`dashboard-bg`).
- **Class Merging:** The `clsx` and `tailwind-merge` libraries are heavily used (usually wrapped in a `cn` utility function) to dynamically apply classes without CSS specificity clashes.

## 4. API Communication

- **Axios:** The client communicates with the server using Axios instances configured with interceptors. These interceptors automatically attach cookies (via `withCredentials: true`) and handle global error states (e.g., redirecting to login on 401 Unauthorized responses).
- **Service Abstraction:** API calls are not made directly inside components. They are abstracted into `client/src/services` to maintain separation of concerns.

## 5. Global AI Assistant

Because `AIAssistant` is mounted in the root `layout.tsx`, it acts as an omnipresent helper. It uses the `buildAssistantPrompt` on the backend, meaning it can read the user's current URL and page context to provide highly relevant help (e.g., if the user is on `/projects/new`, the AI assistant knows they are trying to create a project).
