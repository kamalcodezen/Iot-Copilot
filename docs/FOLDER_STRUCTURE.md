# Folder Structure

The project is structured as a monorepo with distinct `client` and `server` environments.

```text
Iot-copilot/
├── client/                     # Next.js Frontend App
│   ├── public/                 # Static assets (images, icons)
│   └── src/
│       ├── app/                # App Router (Pages & Global Layouts)
│       ├── components/         # Shared global UI elements
│       ├── features/           # Domain-isolated modules (ai, projects, landing)
│       ├── lib/                # API fetching layer and core utilities
│       ├── types/              # Global TypeScript interfaces
│       └── utils/              # Generic utility functions
├── server/                     # Express.js Backend API
│   └── src/
│       ├── config/             # Environment and external service configs
│       ├── controllers/        # HTTP Request handlers
│       ├── middlewares/        # Express middleware (auth, validation)
│       ├── models/             # Mongoose DB schemas
│       ├── routes/             # API endpoint definitions
│       ├── services/           # Business logic execution
│       ├── types/              # Backend TypeScript interfaces
│       ├── utils/              # Server utility functions
│       └── validators/         # Zod data validation schemas
└── docs/                       # Project Documentation System
```

## Adding Future Files
- **New API Feature:** Start in `server/src/models/`, then `validators/`, `services/`, `controllers/`, and finally `routes/`. Expose it via `client/src/lib/api/`.
- **New UI Feature:** Build isolated components in `client/src/features/`, then mount them in `client/src/app/`.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Revision History:** Initial release (v1.0.0)
