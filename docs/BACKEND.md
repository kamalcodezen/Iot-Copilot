# Backend Documentation

The backend is an Express.js server located in `server/`, structured by technical layers.

## Directory Structure

- **`controllers/`**: Extracts data from HTTP requests (`req.body`, `req.query`), invokes the relevant Service, and formats the HTTP response (`res.json()`).
- **`routes/`**: Connects HTTP methods and paths to Controllers. Attaches middlewares.
- **`middlewares/`**: Request interceptors. Includes `auth` (Better Auth integration), `validate` (Zod schema checking), and `errorHandler`.
- **`services/`**: The core business logic layer. Performs DB operations via Models and interacts with external APIs (like Gemini).
- **`models/`**: Mongoose schemas defining the MongoDB collections.
- **`validators/`**: Zod schemas used by the validation middleware to sanitize incoming data.
- **`config/`**: Setup logic for the application (e.g., MongoDB connection, Better Auth config).
- **`types/`**: TypeScript interfaces and types for the backend scope.
- **`utils/`**: Helper utilities (e.g., `logger.ts`, `ApiResponse.ts`).

## Request Lifecycle
1. **Incoming Request** hits a Route (e.g., `POST /api/projects`).
2. **Middleware:** `auth` checks for a valid session. `validate` ensures the body matches the Zod schema.
3. **Controller:** Receives the validated request and calls `ProjectService.createProject()`.
4. **Service:** Executes logic and uses `ProjectModel` to save to MongoDB.
5. **Controller:** Formats the successful result or catches errors via the global error handler.

## Authentication Lifecycle
1. User submits credentials to `POST /api/auth/login`.
2. Better Auth validates credentials against the `Users` collection.
3. Upon success, Better Auth generates a session and sets an `HttpOnly` cookie.
4. Subsequent requests include the cookie, which the `requireAuth` middleware verifies.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [API.md](./API.md), [AUTHENTICATION.md](./AUTHENTICATION.md)
- **Revision History:** Initial release (v1.0.0)
