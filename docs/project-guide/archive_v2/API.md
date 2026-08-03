

<!-- Content from API.md -->

# API Documentation

This outlines the core backend API endpoints.

## Base URL
`/api`

## Authentication
Routes marked with **Auth Required** require a valid HttpOnly session cookie provided by Better Auth.

## Endpoints

### 1. Authentication (`/api/auth`)
Handles user login, signup, and session management (powered by Better Auth). Refer to [AUTHENTICATION.md](./AUTHENTICATION.md).

### 2. Projects (`/api/projects`)
- **GET /api/projects**
  - **Auth Required:** Yes
  - **Response:** Array of Project objects.
- **POST /api/projects**
  - **Auth Required:** Yes
  - **Request Body:** `{ name: string, description: string }`
  - **Response:** Created Project object.

### 3. AI Mentor (`/api/ai`)
- **POST /api/ai/chat**
  - **Auth Required:** Yes
  - **Request Body:** `{ message: string, context: any }`
  - **Response:** Steamed chunks or JSON depending on Accept header.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [BACKEND.md](./BACKEND.md)
- **Revision History:** Initial release (v1.0.0)


<!-- Content from 10_API_Documentation.md -->

# 10. API Documentation

This document outlines the REST API endpoints exposed by the Express.js backend. All routes are prefixed with `/api`.

## Global Middleware
- `requireAuth`: Validates Better Auth session. Applied to almost all routes except webhooks or public integrations.
- `express.json()`: Parses incoming JSON payloads.

---

## 1. Authentication Routes (`/api/auth/*`)
Better Auth handles these endpoints natively. Mongoose controllers do not touch them.
- `POST /api/auth/sign-up/email`: Registers a new user.
- `POST /api/auth/sign-in/email`: Authenticates and sets HTTP-only session cookie.
- `POST /api/auth/sign-out`: Destroys the session.
- `GET /api/auth/get-session`: Returns the current user profile and session data.
- `POST /api/auth/update-user`: Updates user profile data (Name, etc.).
- `POST /api/auth/change-password`: Updates password and revokes old sessions.

---

## 2. Dashboard Routes (`/api/dashboard`)

### `GET /api/dashboard/stats`
- **Description:** Aggregates total projects, learning streaks, and hours.
- **Middleware:** `requireAuth`
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "stats": { "learningStreak": 5, "totalSessions": 12, "totalHours": 24 },
      "totals": { "totalProjects": 3 },
      "dailyActivity": [{ "date": "2026-07-31", "count": 2 }]
    }
  }
  ```

### `GET /api/dashboard/activities`
- **Description:** Returns the user's chronological activity ledger.
- **Query Params:** `limit` (default 10)
- **Response:** Array of `Activity` objects.

---

## 3. Project Routes (`/api/projects`)

### `GET /api/projects`
- **Description:** Fetches all projects for the authenticated user.
- **Query Params:** `limit`
- **Response:** Array of `Project` objects.

### `GET /api/projects/:id`
- **Description:** Fetches a specific project by ID.
- **Errors:** `404 Not Found`, `403 Forbidden` (if user does not own project).

### `POST /api/projects`
- **Description:** Creates a new manual project.
- **Validation:** Zod schema checks `title`, `description`, `status`.
- **Request Body:**
  ```json
  {
    "title": "Smart Garden",
    "description": "ESP32 based moisture monitor",
    "status": "in-progress"
  }
  ```

### `PATCH /api/projects/:id`
- **Description:** Updates project milestones or status.

### `DELETE /api/projects/:id`
- **Description:** Removes a project and logs an `Activity` indicating deletion.

---

## 4. AI Integration Routes (`/api/ai`)

### `POST /api/ai/chat`
- **Description:** Streams a response from the AI Mentor.
- **Request Body:** `{ "messages": [{ "role": "user", "content": "How do I wire an I2C OLED?" }] }`
- **Response:** Text/Event-Stream (SSE) containing raw text chunks from Groq.
- **Errors:** `429 Too Many Requests` (Quota Exceeded).

### `POST /api/ai/debug`
- **Description:** Analyzes stack traces and sensor logs.
- **Request Body:** `{ "logData": "...", "codeSnippet": "..." }`
- **Response:** JSON with identified root cause and recommended code fix.

### `GET /api/ai/recommend`
- **Description:** Generates contextual suggestions for the dashboard based on recent activities.
- **Response:** Array of suggestion objects.
