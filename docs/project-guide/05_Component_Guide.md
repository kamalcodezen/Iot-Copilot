# 05. Component Guide

This document describes the key React components within the `client/src` directory, categorized by their level of abstraction.

## 1. Global Layout Components (`components/layout/`)

### `Navbar.tsx`
- **Purpose:** Primary navigation header.
- **Props:** None (Uses global state).
- **State/Hooks:** `useAuthStore()` to toggle login/logout CTAs. `useState` for mobile menu toggles and dropdown states.
- **Key Features:** Uses Framer Motion for scroll-responsive glassmorphism, floating active indicators, and magnetic CTA buttons. It is fully responsive.

### `Footer.tsx`
- **Purpose:** Standard site footer containing links and branding.
- **Reusability:** Appears only on the Landing Page.

## 2. Reusable UI Components (`components/ui/`)

These components are purely presentational and have no side effects or API calls.

### `Button.tsx`
- **Purpose:** Standardized button with variants (primary, secondary, outline, ghost).
- **Props:** `variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`.
- **Children:** Allows arbitrary child nodes.

### `Card.tsx`
- **Purpose:** Container applying the global glassmorphic or solid panel styling.
- **Reusability:** Extremely high. Used in Dashboard, Projects, and AI modules.

### `IoTLoader.tsx`
- **Purpose:** A complex, animated SVG loading spinner that mimics IoT network nodes passing data packets.
- **Props:** `size` ('sm', 'md', 'lg'), `message` (optional text below the loader).
- **Design:** Uses `framer-motion` for pulsating nodes and traveling data lines.

### `Avatar.tsx`
- **Purpose:** Displays the user's initial or profile picture.
- **Props:** `name`, `size`, `status` ('online', 'offline', 'away').

## 3. Feature-Specific Components (`features/`)

These components contain domain-specific business logic or data structures.

### `ProgressChart.tsx` (`features/dashboard/`)
- **Purpose:** Visualizes user activity over the last 30 days.
- **Dependencies:** `recharts`.
- **Props:** `data` (Array of date/count objects).
- **Design:** Line chart with gradient stroke, custom tooltips, and smooth entrance animations.

### `SkillRadar.tsx` (`features/dashboard/`)
- **Purpose:** Displays a multi-axial map of the user's IoT skills (e.g., Hardware, Cloud, Embedded).
- **Dependencies:** `recharts` (RadarChart, PolarGrid).
- **Props:** `data`.

### `ChatContainer.tsx` (`features/ai/`)
- **Purpose:** The core AI Mentor interface.
- **State:** Manages the `messages` array, `input` string, and `isStreaming` boolean.
- **Hooks:** Uses `useRef` for auto-scrolling to the bottom of the chat.
- **Dependencies:** `lib/api/ai-stream.ts` to connect to the backend.

### `ProjectForm.tsx` (`features/projects/`)
- **Purpose:** Form for creating new manual projects.
- **Hooks:** Uses `react-hook-form` and `zod` resolver for client-side validation.
- **Parent:** `app/projects/new/page.tsx`.

## 4. Design Patterns Used
- **Compound Components:** Complex elements like Forms are built using smaller components (Input, Label, ErrorMessage).
- **Prop Drilling vs. Zustand:** Props are used exclusively for UI configuration (e.g., `variant="primary"`). Global state (user identity) is pulled directly from Zustand to avoid deep prop drilling.
- **Tailwind Merging:** `cn()` (clsx + tailwind-merge) is heavily utilized to allow parents to override default component styles safely via the `className` prop.
