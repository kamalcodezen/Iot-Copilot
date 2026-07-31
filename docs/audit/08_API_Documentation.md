# API Documentation: IoT Copilot AI

This document catalogs every API endpoint exposed by the Express backend.

*Note: All endpoints are prefixed with `/api` as defined in `app.ts`.*

---

## 1. Authentication (`/api/auth`)
*These routes are dynamically handled by the Better Auth middleware. There are no explicit controllers for most of these.*

- **GET `/api/auth/me`**
  - **Purpose:** Returns the currently authenticated user's session data.
  - **Auth Required:** Yes (via cookies).
- **POST `/api/auth/sign-in`** (Implicit)
  - **Purpose:** Logs in a user.
- **POST `/api/auth/sign-up`** (Implicit)
  - **Purpose:** Registers a new user.
- **POST `/api/auth/sign-out`** (Implicit)
  - **Purpose:** Destroys the current session.

---

## 2. User Profiles (`/api/users`)

- **GET `/:id`**
  - **Purpose:** Get a user's public profile data.
- **PUT `/:id`**
  - **Purpose:** Update user preferences, bio, or skill level.
  - **Auth Required:** Yes
- **PUT `/:id/avatar`**
  - **Purpose:** Upload a new avatar image (uses `multer` and Cloudinary).
  - **Auth Required:** Yes
- **GET `/:id/projects`**
  - **Purpose:** Retrieve all projects belonging to a specific user.
- **GET `/:id/badges`**
  - **Purpose:** Retrieve earned badges for a user.

---

## 3. Projects (`/api/projects`)

- **GET `/`**
  - **Purpose:** Get all projects for the authenticated user (supports filtering/pagination).
  - **Auth Required:** Yes
- **GET `/:id`**
  - **Purpose:** Get details of a specific project.
  - **Auth Required:** Yes
- **POST `/`**
  - **Purpose:** Create a new project manually.
  - **Auth Required:** Yes
- **PUT `/:id`**
  - **Purpose:** Update project details (title, description, code, etc.).
  - **Auth Required:** Yes
- **DELETE `/:id`**
  - **Purpose:** Delete a project.
  - **Auth Required:** Yes
- **PATCH `/:id/progress`**
  - **Purpose:** Update the completion percentage of a project.
  - **Auth Required:** Yes
- **POST `/:id/like`**
  - **Purpose:** Toggle a like on a project.
  - **Auth Required:** Yes

---

## 4. AI Features (`/api/ai`)
*Many of these endpoints use Server-Sent Events (SSE) for streaming.*

- **POST `/chat`**
  - **Purpose:** Interact with the AI Mentor (streams response).
  - **Auth Required:** Yes
- **GET `/chat/history`**
  - **Purpose:** Retrieve previous AI chat messages.
  - **Auth Required:** Yes
- **POST `/roadmap`**
  - **Purpose:** Generate a personalized learning path.
  - **Auth Required:** Yes
- **POST `/recommend-components`**
  - **Purpose:** Suggest hardware components based on project ideas.
  - **Auth Required:** Yes
- **POST `/plan-project`**
  - **Purpose:** Architect a complete project plan.
  - **Auth Required:** Yes
- **POST `/debug`**
  - **Purpose:** Step-by-step hardware/software diagnostic stream.
  - **Auth Required:** Yes
- **POST `/interview`**
  - **Purpose:** Generate 5 interview questions based on topic.
  - **Auth Required:** Yes
- **POST `/interview/submit`**
  - **Purpose:** Evaluate the user's answer to an interview question.
  - **Auth Required:** Yes
- **GET `/recommend`**
  - **Purpose:** Suggest next topics to learn based on history.
  - **Auth Required:** Yes
- **POST `/assistant`**
  - **Purpose:** General context-aware AI assistant (used across the platform).
  - **Auth Required:** Optional

---

## 5. Learning Paths (`/api/learning-paths`)

- **GET `/`**
  - **Purpose:** Get the user's generated learning roadmaps.
  - **Auth Required:** Yes
- **GET `/:id`**
  - **Purpose:** Get details of a specific roadmap.
  - **Auth Required:** Yes
- **PUT `/:id`**
  - **Purpose:** Update roadmap progress (e.g., mark module as completed).
  - **Auth Required:** Yes
- **DELETE `/:id`**
  - **Purpose:** Delete a roadmap.
  - **Auth Required:** Yes

---

## 6. Community (`/api/community`)

- **GET `/projects`**
  - **Purpose:** Get a feed of public projects from all users.
  - **Auth Required:** Optional
- **GET `/projects/:id`**
  - **Purpose:** View a specific public project.
  - **Auth Required:** Optional
- **POST `/projects/:id/comments`**
  - **Purpose:** Add a comment to a public project.
  - **Auth Required:** Yes
- **GET `/projects/:id/comments`**
  - **Purpose:** Retrieve comments for a project.

---

## 7. User Activity (`/api/activities`)

- **GET `/`**
  - **Purpose:** Get the user's activity feed (timeline of events).
  - **Auth Required:** Yes
- **GET `/stats`**
  - **Purpose:** Get aggregated statistics (projects completed, hours learned) for the dashboard.
  - **Auth Required:** Yes

---

## 8. Admin (`/api/admin`)

- **GET `/users`**
  - **Purpose:** List all platform users.
  - **Auth Required:** Yes (Admin only)
- **PATCH `/users/:id/role`**
  - **Purpose:** Promote/demote user roles.
  - **Auth Required:** Yes (Admin only)
- **DELETE `/users/:id`**
  - **Purpose:** Ban/Delete a user.
  - **Auth Required:** Yes (Admin only)
- **GET `/stats`**
  - **Purpose:** Get platform-wide analytics.
  - **Auth Required:** Yes (Admin only)
