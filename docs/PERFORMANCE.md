# Performance

## Frontend
- **Code Splitting:** Native via Next.js App Router.
- **Image Optimization:** Leveraging `next/image`.
- **Lazy Loading:** Heavy features (like 3D viewers or heavy charts) load dynamically.

## Backend
- **Streaming:** The AI module streams tokens to prevent connection timeouts and improve perceived speed.
- **Database Indexes:** MongoDB queries are indexed (e.g., by `userId`) to ensure fast read operations at scale.

---
### Document Meta
- **Last Updated:** 2026-07-29
- **Related Documents:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Revision History:** Initial release (v1.0.0)
