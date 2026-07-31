# System Architecture

## Architecture Philosophy
IoT Copilot is built on a strict separation of concerns, ensuring modularity, type safety, and scalability. The frontend handles presentation and user interaction, while the backend is responsible for business logic, data persistence, and external API integrations (like Gemini AI).

## Layer Responsibilities
- **Client Components:** Handle UI rendering, local state, and capturing user input.
- **Client API Lib (`lib/api`):** Typed wrapper functions for all HTTP requests to the backend.
- **Client Core (`lib/core`):** Core networking configuration, specifically the `server.ts` fetch wrapper.
- **Backend Controllers:** Route handlers that extract request data and format HTTP responses.
- **Backend Services:** Execute business logic and interact with the database models.
- **Backend Models:** Define the MongoDB schema and handle direct database operations.

## Application Flow

```mermaid
graph TD
    A[Component (e.g., ProjectForm)] -->|Calls helper| B[lib/api/project.ts]
    B -->|Invokes fetcher| C[lib/core/server.ts]
    C -->|HTTP REST| D[Backend Router]
    D -->|Validates/Routes| E[Backend Controller]
    E -->|Business Rules| F[Backend Service]
    F <-->|Mongoose Queries| G[(MongoDB)]
    F <-->|AI Prompting| H[Gemini API]
```

## Architectural Decisions
1. **No direct `fetch` in components:** To ensure consistency and centralized error handling, all network requests must go through `lib/api`.
2. **Service Layer in Backend:** Keeps controllers thin and makes business logic testable and reusable.
3. **Zod Validation:** Ensures data integrity at runtime before processing logic.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [FRONTEND.md](./FRONTEND.md), [BACKEND.md](./BACKEND.md)
- **Revision History:** Initial release (v1.0.0)
