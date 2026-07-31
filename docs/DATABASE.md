# Database Documentation

The application uses MongoDB as its primary datastore, mapped via Mongoose schemas.

## Collections & Relationships

### 1. Users
- **Purpose:** Stores user credentials and Better Auth session details.
- **Indexes:** `email_1` (Unique)

### 2. Projects
- **Purpose:** Stores metadata for IoT projects.
- **Relationships:** Belongs to a `User` (1:N).
- **Indexes:** `userId_1` (for fast user-based lookups).

### 3. Chats
- **Purpose:** Stores conversation histories with the AI Mentor.
- **Relationships:** Belongs to a `User` and optionally a `Project`.

## Data Flow
- All read/writes occur in the `services/` layer of the backend.
- Controllers never execute Mongoose methods directly.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Revision History:** Initial release (v1.0.0)
