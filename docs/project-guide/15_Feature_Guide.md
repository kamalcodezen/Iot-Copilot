# 15. Feature Guide

This document catalogs every major feature in IoT Copilot, detailing how it works, why it was built, and the underlying files.

## 1. Authentication System
- **Purpose:** Securely manages user identity.
- **How it works:** Utilizes Better Auth for password hashing and HTTP-Only session cookies. Integrated tightly with a React Zustand store for instantaneous UI updates.
- **Files:** `server/src/config/auth.ts`, `client/src/lib/auth-client.ts`, `client/src/store/authStore.ts`.

## 2. Interactive Dashboard
- **Purpose:** Provides a heads-up display of the user's progress and activity.
- **How it works:** Pulls aggregated stats (projects count, learning streak) and recent activity logs from the backend. Uses Recharts to visualize this data (e.g., `ProgressChart` and `SkillRadar`).
- **Files:** `client/src/app/dashboard/page.tsx`, `client/src/features/dashboard/*`, `server/src/controllers/dashboardController.ts`.

## 3. AI Project Planner
- **Purpose:** Automatically generates an IoT architecture based on a user's textual prompt.
- **How it works:** The prompt is sent to the Gemini AI, which is instructed to return a strict JSON schema representing the hardware list, milestones, and MCU choice. The backend parses this JSON and saves it to MongoDB.
- **Files:** `client/src/features/projects/components/ProjectForm.tsx`, `server/src/services/ai.ts`, `server/src/models/Project.ts`.

## 4. AI Mentor Chat
- **Purpose:** A conversational AI specifically tuned for embedded engineering.
- **How it works:** Uses Server-Sent Events (SSE) to stream chunks of text from the Gemini API back to the React client in real time.
- **Files:** `client/src/features/ai/components/ChatContainer.tsx`, `client/src/lib/api/ai-stream.ts`.

## 5. AI Debugger
- **Purpose:** Analyzes stack traces and sensor logs to find hardware/software mismatches.
- **How it works:** Takes two inputs (log data and code snippet). The AI matches the error trace against the code logic (e.g., mismatched Baud rates) and outputs a markdown-formatted diagnosis.
- **Files:** `client/src/app/ai-debugger/page.tsx`.

## 6. Learning Path
- **Purpose:** A gamified curriculum for IoT concepts.
- **How it works:** A static visual tree (using SVG lines connecting HTML nodes) that tracks completed modules. Updating a module alters the user's Skill Radar.
- **Files:** `client/src/app/learning-path/page.tsx`.

---

# Future Improvements
- **WebSockets for IoT Data:** Allow users to connect their actual ESP32/Raspberry Pi devices to the dashboard via MQTT/WebSockets for real-time telemetry visualization.
- **Social / Community Hub:** Expand the `Comment` model to allow users to upvote and fork each other's public projects.
