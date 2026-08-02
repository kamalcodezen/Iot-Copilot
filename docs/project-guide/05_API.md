# 05. API

## Purpose
This document outlines the REST API endpoints exposed by the Express.js backend.

## When to read
Read this when you need to interact with the backend from a frontend Server Action/Client Component, or when you are adding a new Express route.

## Related documents
- [04. Authentication](./04_Authentication.md)
- [08. Code Flow](./08_Code_Flow.md)

## Table of Contents
- [Global Middleware](#global-middleware)
- [1. Authentication Routes (`/api/auth/*`)](#1-authentication-routes-apiauth)
- [2. Dashboard Routes (`/api/dashboard`)](#2-dashboard-routes-apidashboard)
- [3. Project Routes (`/api/projects`)](#3-project-routes-apiprojects)
- [4. AI Integration Routes (`/api/ai`)](#4-ai-integration-routes-apiai)

## Main Content

All routes are prefixed with `/api`.

### Global Middleware
- `requireAuth`: Validates Better Auth session. Applied to almost all routes except webhooks or public integrations.
- `express.json()`: Parses incoming JSON payloads.

---

### 1. Authentication Routes (`/api/auth/*`)
Better Auth handles these endpoints natively. Mongoose controllers do not touch them.
- `POST /api/auth/sign-up/email`: Registers a new user.
- `POST /api/auth/sign-in/email`: Authenticates and sets HTTP-only session cookie.
- `POST /api/auth/sign-out`: Destroys the session.
- `GET /api/auth/get-session`: Returns the current user profile and session data.
- `POST /api/auth/update-user`: Updates user profile data (Name, etc.).
- `POST /api/auth/change-password`: Updates password and revokes old sessions.

---

### 2. Dashboard Routes (`/api/dashboard`)

#### `GET /api/dashboard/stats`
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

#### `GET /api/dashboard/activities`
- **Description:** Returns the user's chronological activity ledger.
- **Query Params:** `limit` (default 10)
- **Response:** Array of `Activity` objects.

---

### 3. Project Routes (`/api/projects`)

#### `GET /api/projects`
- **Description:** Fetches all projects for the authenticated user.
- **Query Params:** `limit`
- **Response:** Array of `Project` objects.

#### `GET /api/projects/:id`
- **Description:** Fetches a specific project by ID.
- **Errors:** `404 Not Found`, `403 Forbidden` (if user does not own project).

#### `POST /api/projects`
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

#### `PATCH /api/projects/:id`
- **Description:** Updates project milestones or status.

#### `DELETE /api/projects/:id`
- **Description:** Removes a project and logs an `Activity` indicating deletion.

---

### 4. AI Integration Routes (`/api/ai`)

#### `POST /api/ai/chat`
- **Description:** Streams a response from the AI Mentor.
- **Request Body:** `{ "messages": [{ "role": "user", "content": "How do I wire an I2C OLED?" }] }`
- **Response:** Text/Event-Stream (SSE) containing raw text chunks from Gemini.
- **Errors:** `429 Too Many Requests` (Quota Exceeded).

#### `POST /api/ai/debug`
- **Description:** Analyzes stack traces and sensor logs.
- **Request Body:** `{ "logData": "...", "codeSnippet": "..." }`
- **Response:** JSON with identified root cause and recommended code fix.

#### `GET /api/ai/recommend`
- **Description:** Generates contextual suggestions for the dashboard based on recent activities.
- **Response:** Array of suggestion objects.

## Related Source Code
- `server/src/routes/*`
- `server/src/controllers/*`

## Last Updated
2026-08-02
