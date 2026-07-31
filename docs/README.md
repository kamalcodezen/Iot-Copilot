# IoT Copilot

## Project Overview
IoT Copilot is an intelligent, AI-driven platform designed to assist developers in creating, managing, and debugging Internet of Things (IoT) projects. It accelerates IoT development through AI-powered mentoring, debugging, and robust project management features.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB, Mongoose
- **Authentication:** Better Auth
- **AI:** Google Gemini API

## Architecture Overview
The application follows a standard Client-Server architecture. The Next.js frontend communicates with the Express backend via REST APIs. The backend interacts with MongoDB for data persistence and the Gemini API for AI features. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed flows.

## Quick Start
1. **Clone the repository.**
2. **Setup Environment:** Copy `.env.example` to `.env` in both `client/` and `server/` directories. Configure variables (e.g., `MONGO_URI`, `GEMINI_API_KEY`).
3. **Install Dependencies:** Run `npm install` in both `client/` and `server/`.
4. **Run Locally:** Run `npm run dev` in both directories.

## Documentation Index
- [Architecture Guide](./ARCHITECTURE.md)
- [Frontend Documentation](./FRONTEND.md)
- [Backend Documentation](./BACKEND.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)
- [API Documentation](./API.md)
- [Database Documentation](./DATABASE.md)
- [Authentication](./AUTHENTICATION.md)
- [AI Module](./AI_MODULE.md)
- [State Management](./STATE_MANAGEMENT.md)
- [Coding Standards](./CODING_STANDARDS.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Environment Variables](./ENVIRONMENT_VARIABLES.md)
- [Security](./SECURITY.md)
- [Performance](./PERFORMANCE.md)
- [Testing Guide](./TESTING.md)
- [User Guide](./USER_GUIDE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Maintenance Guide](./MAINTENANCE.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Changelog](./CHANGELOG.md)
- [Roadmap](./ROADMAP.md)
- [FAQ](./FAQ.md)

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** None
- **Revision History:** Initial release (v1.0.0)
