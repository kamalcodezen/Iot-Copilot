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
