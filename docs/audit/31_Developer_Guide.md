# Developer Guide: IoT Copilot AI

Welcome to the IoT Copilot AI repository! This guide provides everything a new software engineer needs to spin up the local development environment and begin contributing immediately.

---

## 1. Prerequisites

Before you clone the repository, ensure your machine has the following installed:
- **Node.js**: v20 or higher (We recommend using `nvm`).
- **MongoDB**: You can run this locally via Docker (`docker run -d -p 27017:27017 mongo`) or use a free tier on MongoDB Atlas.
- **Git**: For version control.
- **A Google Cloud Account**: To obtain OAuth credentials and a Gemini API key.

---

## 2. Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/iot-copilot.git
   cd iot-copilot
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
   *Open `.env` and fill in your `MONGODB_URI`, `GEMINI_API_KEY`, and Google OAuth credentials.*

3. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   ```
   *Open `.env` and ensure `NEXT_PUBLIC_API_URL` points to `http://localhost:5000`.*

4. **Run the Development Servers:**
   Open two separate terminal windows.
   - Terminal 1 (Server): `cd server && npm run dev`
   - Terminal 2 (Client): `cd client && npm run dev`

5. **Verify:** Open your browser and navigate to `http://localhost:3000`. You should see the landing page.

---

## 3. Project Structure Refresher

This is a decoupled Full-Stack application.
- **`client/`**: Next.js 16 (App Router), React 19, Tailwind v4. Uses Zustand for UI state and React Query for server data fetching.
- **`server/`**: Node.js, Express, TypeScript. Uses Mongoose for database modeling and Better Auth for session management.

## 4. Coding Conventions

- **TypeScript Strict Mode:** Both projects run in strict mode. Do not use `any` types. Use `unknown` if a type is truly dynamic, and validate it using Zod before consuming it.
- **Fat Services, Thin Controllers:** When writing backend code, do not put complex loops, API calls, or formatting logic in the Express Controller. Place that logic in `server/src/services/` and simply call the service function from the controller.
- **Error Handling:** On the backend, never use `res.status(500).json(...)`. Instead, throw a specific error class (e.g., `throw new NotFoundError("Project missing")`) or pass the error to `next(err)`. The global error handler in `app.ts` will catch it and format the response correctly.

## 5. Branching & PR Strategy

- We use standard GitHub Flow.
- Branch off `main` for all work. Use the format `feature/your-feature-name` or `bugfix/issue-description`.
- Before pushing, ensure you run `npm run lint` and `npm run build` in both directories.
- PR titles should follow Conventional Commits (e.g., `feat: added hardware simulator support`).

## 6. Where to get help?

If you are stuck understanding how the AI streaming works, refer to `05_AI_System.md`. If you are confused by the database relations, check `06_Database.md`. All documentation is located in the `docs/audit/` directory.
