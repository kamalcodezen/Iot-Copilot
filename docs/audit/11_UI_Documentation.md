# UI Documentation: IoT Copilot AI

This document reviews the major user interfaces, pages, and their associated user flows in the client application.

## Overview
The UI is constructed using Next.js App Router. Each major feature has a dedicated route directory inside `client/src/app`. The design language prioritizes a clean, dark-mode-first aesthetic with smooth micro-animations powered by Framer Motion.

---

## Core Pages

### 1. Landing Page (`/`)
- **Purpose:** Public-facing marketing page explaining the value proposition of the AI Mentor.
- **User Flow:** An unauthenticated user lands here. Calls to action (CTAs) direct them to the `/auth` page to sign up.

### 2. Dashboard (`/dashboard`)
- **Purpose:** The central hub for authenticated users.
- **Components Used:** Stats cards, Recent Activity feed, Active Projects list.
- **API Used:** `GET /api/activities/stats`, `GET /api/activities`.
- **User Flow:** After login, users are redirected here. It gives a bird's-eye view of their learning progress and allows quick jumps back into active projects or the AI mentor.

### 3. Projects Hub (`/projects`)
- **Purpose:** Lists all user-created IoT projects.
- **User Flow:** Users can filter their projects by status. Clicking "New Project" opens a wizard. Clicking a project navigates to `/projects/[id]`.
- **Sub-page (`/projects/[id]`):** The Project Details page. This is a complex view showing the circuit description, required components, code editor view, and progress tracking. 

### 4. AI Mentor (`/ai-mentor`)
- **Purpose:** The dedicated chat interface for general IoT learning and questions.
- **Components Used:** Message List, Chat Input (with auto-resize), Code Highlighters.
- **API Used:** `POST /api/ai/chat` (SSE streaming), `GET /api/ai/chat/history`.
- **User Flow:** Users type questions about IoT. The UI streams the response in real-time, parsing Markdown and rendering code blocks with syntax highlighting.

### 5. AI Debugger (`/ai-debugger`)
- **Purpose:** A structured diagnostic tool for fixing broken hardware/software.
- **User Flow:** Rather than an open chat, this page usually starts with a structured form asking for the Board (e.g., ESP32), Components, Error Message, and Problem Description. Upon submission, it drops the user into a targeted diagnostic chat session.

### 6. Learning Paths (`/learning-path`)
- **Purpose:** Displays personalized, AI-generated curriculum roadmaps.
- **Components Used:** Timeline/Stepper components showing modules, Progress bars.
- **User Flow:** Users select their goals and skill level. The AI generates a roadmap. The user can then click through modules, mark them as complete, and track their overall progress.

### 7. Interview Coach (`/interview-coach`)
- **Purpose:** Simulates technical interviews.
- **User Flow:** User selects a topic (e.g., "Sensors" or "MQTT"). AI generates 5 questions. The UI presents them one by one. The user types their answer, submits it, and receives a detailed score and feedback via the AI.

### 8. Community (`/community`)
- **Purpose:** A gallery of public projects built by other users.
- **Components Used:** Project Cards (masonry or grid layout), Search/Filter bars, Comment sections.
- **API Used:** `GET /api/community/projects`.
- **User Flow:** Users browse for inspiration. They can click into a project to see the code and components, and leave comments or likes.

### 9. Profile & Settings (`/profile`, `/settings`)
- **Purpose:** Managing user data, avatars, and application preferences (like theme or notifications).
- **User Flow:** Forms for updating the `User` document. Uses React Hook Form + Zod for client-side validation before calling `PUT /api/users/:id`.

---

## Global Components

- **Navbar (`<Navbar />`):** Sticky top navigation. Changes links based on auth state (Better Auth).
- **Global AI Assistant (`<AIAssistant />`):** A floating action button (FAB) in the bottom corner. Clicking it opens a slide-over panel. This allows the user to ask contextual questions without leaving their current page (e.g., asking for help while staring at a specific project's code).
