# Component Documentation: IoT Copilot AI

This document provides a detailed review of every React component in the `client/src/components` directory.

---

## AI Components (`client/src/components/ai`)

### `AIAssistant.tsx`
- **Purpose:** The global floating AI chat widget.
- **Problem it solves:** Allows users to ask questions without losing their current page context.
- **Responsibilities:** Manages the open/close state of the chat window. Handles the SSE streaming response from the backend. Automatically injects the current page URL into the request payload for context.
- **Imports:** `lucide-react` for icons, Zustand store for state, `aiService` for API calls.
- **Can it be simplified?** If it holds too much local state for the chat history, that state could be moved into a Zustand store to persist chats even if the component unmounts (though since it's mounted in `layout.tsx`, it rarely unmounts).

---

## Layout Components (`client/src/components/layout`)

### `AuthGuard.tsx`
- **Purpose:** Protects private routes.
- **Responsibilities:** Checks the Better Auth session state. If unauthenticated, it intercepts the render and redirects the user to `/auth/login` or renders a fallback.
- **Data Flow:** Reads from the auth Zustand store or calls `/api/auth/me`.

### `Navbar.tsx`
- **Purpose:** The top navigation bar.
- **Responsibilities:** Renders links to Dashboard, Projects, Community, etc. Displays the user's Avatar and a "Logout" button if authenticated, or a "Login" button if not.
- **Can it be simplified?** Standard implementation. No major changes needed.

### `Sidebar.tsx` & `MobileNav.tsx`
- **Purpose:** Navigation for dashboard views and mobile responsiveness.
- **Responsibilities:** `Sidebar` is usually visible on desktop `lg` breakpoints. `MobileNav` renders a hamburger menu triggering a slide-out drawer on smaller screens.
- **Dependencies:** Uses Framer Motion for the slide-out animation.

### `Footer.tsx`
- **Purpose:** Standard page footer containing links to terms, GitHub repo, etc.

---

## UI Components (`client/src/components/ui`)
*These are generic, reusable presentational components. They are mostly stateless and rely heavily on Tailwind classes via `clsx` and `tailwind-merge`.*

### `Button.tsx`
- **Purpose:** Standardized button with variants (primary, secondary, danger, ghost, outline) and sizes (sm, md, lg). 
- **Business Logic:** None. Pure UI.

### `Input.tsx`
- **Purpose:** Styled text input field. Often wrapped with `React.forwardRef` to integrate seamlessly with `react-hook-form`.

### `Card.tsx`
- **Purpose:** A container component with standard padding, border-radius, and background colors. Used extensively in the Dashboard and Projects Hub.

### `Badge.tsx`
- **Purpose:** Small pill-shaped text indicators (e.g., used for project status like "In Progress" or difficulty like "Beginner").
- **Variants:** Colors map to statuses (Green = Complete, Yellow = In Progress).

### `Avatar.tsx`
- **Purpose:** Displays user profile pictures with a fallback to their initials if the image fails to load or isn't provided.

### `Modal.tsx`
- **Purpose:** Accessible dialog overlay.
- **Dependencies:** Often uses Framer Motion for fade-in/scale-up animations and a React Portal to mount at the end of the DOM to avoid z-index issues.

### `Spinner.tsx` & `IoTLoader.tsx`
- **Purpose:** Loading indicators.
- **Difference:** `Spinner` is a generic rotating SVG. `IoTLoader` is likely a custom, branded loading animation (perhaps an SVG of a microchip pulsing) used for AI generation delays to make waiting feel more premium.

### `Toast.tsx`
- **Purpose:** The container or custom renderer for `react-hot-toast`. Ensures notifications match the application's dark mode aesthetic.
